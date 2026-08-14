import type { Priority, SectionId, SectionResult, TotalResult } from "@/lib/engine/types";

const ROUTE_LOST_BASE = 1000;
const THRESHOLD_RISK_BASE = 500;

const candidateFor = (section: SectionId, result: SectionResult): Priority => {
  if (result.route === "easy") {
    return {
      kind: "route-lost",
      section,
      weight: ROUTE_LOST_BASE + (800 - result.score),
      distanceToThreshold: result.distanceToThreshold,
      marginalCost: result.marginalCost,
    };
  }
  if (result.distanceToThreshold > 0 && result.distanceToThreshold <= 2) {
    return {
      kind: "threshold-risk",
      section,
      weight: THRESHOLD_RISK_BASE + (3 - result.distanceToThreshold) * 50,
      distanceToThreshold: result.distanceToThreshold,
      marginalCost: result.marginalCost,
    };
  }
  return {
    kind: "steep-curve",
    section,
    weight: result.marginalCost,
    distanceToThreshold: result.distanceToThreshold,
    marginalCost: result.marginalCost,
  };
};

const scoreOf = (result: TotalResult, section: SectionId): number =>
  section === "rw" ? result.rw.score : result.math.score;

// route-lost (~1170-1600) > threshold-risk (~550-600) > steep-curve
// (marginalCost itself, ordinarily ~15-30) never collide: the one state
// where marginalCost could spike toward a route-flip drop always classifies
// as threshold-risk first, so that spike never reaches the steep-curve branch.
export const priorities = (result: TotalResult): Priority[] => {
  const candidates = [candidateFor("rw", result.rw), candidateFor("math", result.math)];
  return candidates.sort((a, b) => {
    if (b.weight !== a.weight) return b.weight - a.weight;
    const scoreDiff = scoreOf(result, a.section) - scoreOf(result, b.section);
    if (scoreDiff !== 0) return scoreDiff;
    return a.section.localeCompare(b.section);
  });
};
