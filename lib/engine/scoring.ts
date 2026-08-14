import { ENGINE_CONFIG } from "@/lib/engine/config";
import type { Route, SectionId, SectionInput, SectionResult, TotalResult } from "@/lib/engine/types";

type Anchor = readonly [number, number];
type SectionConfig = (typeof ENGINE_CONFIG)[SectionId];

const sortAscending = (anchors: readonly Anchor[]): Anchor[] => [...anchors].sort((a, b) => a[0] - b[0]);

const ANCHORS: Record<Route, Record<SectionId, Anchor[]>> = {
  hard: {
    rw: sortAscending(ENGINE_CONFIG.anchors.hard.rw),
    math: sortAscending(ENGINE_CONFIG.anchors.hard.math),
  },
  easy: {
    rw: sortAscending(ENGINE_CONFIG.anchors.easy.rw),
    math: sortAscending(ENGINE_CONFIG.anchors.easy.math),
  },
};

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));
const roundTo10 = (value: number): number => Math.round(value / 10) * 10;

const interpolate = (anchors: Anchor[], x: number): number => {
  if (x <= anchors[0][0]) return anchors[0][1];
  const last = anchors[anchors.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < anchors.length - 1; i += 1) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (x >= x0 && x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return last[1];
};

// Shared by budget.ts so the exhaustive-scan budget math can never drift
// from scoreSection's own curve.
export const scoreForTotalCorrect = (route: Route, section: SectionId, totalCorrect: number): number => {
  const raw = interpolate(ANCHORS[route][section], totalCorrect);
  const clamped = clamp(roundTo10(raw), 200, 800);
  return route === "easy" ? Math.min(clamped, ENGINE_CONFIG.easyRouteCap[section]) : clamped;
};

// Worst of the two possible next mistakes (M1 or M2). Away from the routing
// threshold both branches land on the same curve and Math.min is a no-op;
// exactly at the threshold the M1 branch falls through to the easy curve,
// so the route-flip drop is captured instead of silently clamped to 0.
const computeMarginalCost = (
  section: SectionId,
  cfg: SectionConfig,
  m1Correct: number,
  m2Correct: number,
  route: Route,
  score: number,
): number => {
  const candidates: number[] = [];

  if (m1Correct > 0) {
    const nextM1Correct = m1Correct - 1;
    const nextRoute: Route = nextM1Correct >= cfg.routingThreshold ? "hard" : "easy";
    candidates.push(scoreForTotalCorrect(nextRoute, section, nextM1Correct + m2Correct));
  }
  if (m2Correct > 0) {
    candidates.push(scoreForTotalCorrect(route, section, m1Correct + m2Correct - 1));
  }

  return candidates.length === 0 ? 0 : score - Math.min(...candidates);
};

export const scoreSection = (section: SectionId, input: SectionInput): SectionResult => {
  const cfg = ENGINE_CONFIG[section];
  const m1Correct = cfg.m1Questions - input.m1Mistakes;
  const m2Correct = cfg.m2Questions - input.m2Mistakes;
  const route: Route = m1Correct >= cfg.routingThreshold ? "hard" : "easy";
  const score = scoreForTotalCorrect(route, section, m1Correct + m2Correct);

  const scoreLow = Math.max(200, score - ENGINE_CONFIG.scoreBand);
  const rawHigh = Math.min(800, score + ENGINE_CONFIG.scoreBand);
  const scoreHigh = route === "easy" ? Math.min(rawHigh, ENGINE_CONFIG.easyRouteCap[section]) : rawHigh;

  return {
    route,
    score,
    scoreLow,
    scoreHigh,
    distanceToThreshold: m1Correct - cfg.routingThreshold + 1,
    marginalCost: computeMarginalCost(section, cfg, m1Correct, m2Correct, route, score),
  };
};

export const scoreTotal = (inputs: Record<SectionId, SectionInput>): TotalResult => {
  const rw = scoreSection("rw", inputs.rw);
  const math = scoreSection("math", inputs.math);
  return {
    rw,
    math,
    total: rw.score + math.score,
    totalLow: rw.scoreLow + math.scoreLow,
    totalHigh: rw.scoreHigh + math.scoreHigh,
  };
};
