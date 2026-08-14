import { ENGINE_CONFIG } from "@/lib/engine/config";
import { scoreForTotalCorrect } from "@/lib/engine/scoring";
import type { ErrorBudget, SectionBudget, SectionId } from "@/lib/engine/types";

type SectionScan = { total: number; m1Max: number };

const SECTION_LABEL: Record<SectionId, string> = { rw: "R&W", math: "Math" };

// Exhaustive scan over correct-counts (domain ≤54 values per section) — the
// spec's own "binary search" description is underspecified, this is the
// dev-plan's chosen replacement.
const scanSectionBudget = (section: SectionId, sectionTarget: number): SectionScan => {
  const cfg = ENGINE_CONFIG[section];
  const maxCorrect = cfg.m1Questions + cfg.m2Questions;
  for (let correct = cfg.routingThreshold; correct <= maxCorrect; correct += 1) {
    if (scoreForTotalCorrect("hard", section, correct) >= sectionTarget) {
      const total = maxCorrect - correct;
      const structuralM1Max = Math.max(0, cfg.m1Questions - cfg.routingThreshold - 1);
      return { total, m1Max: Math.min(structuralM1Max, total) };
    }
  }
  return { total: 0, m1Max: 0 };
};

// Max combined mistakes over every hard/hard (rw, math) correct-count pair
// whose combined score already clears the target — the honest high end of
// "Итого ~N-M ошибок", not just the balanced 50/50 split's total.
const comboMaxMistakes = (target: number): number | null => {
  const rwCfg = ENGINE_CONFIG.rw;
  const mathCfg = ENGINE_CONFIG.math;
  const rwMax = rwCfg.m1Questions + rwCfg.m2Questions;
  const mathMax = mathCfg.m1Questions + mathCfg.m2Questions;

  let best: number | null = null;
  for (let rwCorrect = rwCfg.routingThreshold; rwCorrect <= rwMax; rwCorrect += 1) {
    const rwScore = scoreForTotalCorrect("hard", "rw", rwCorrect);
    for (let mathCorrect = mathCfg.routingThreshold; mathCorrect <= mathMax; mathCorrect += 1) {
      const combined = rwScore + scoreForTotalCorrect("hard", "math", mathCorrect);
      if (combined < target) continue;
      const mistakes = rwMax - rwCorrect + (mathMax - mathCorrect);
      if (best === null || mistakes > best) best = mistakes;
    }
  }
  return best;
};

const noteFor = (section: SectionId, scan: SectionScan): string =>
  `${SECTION_LABEL[section]}: до ${scan.total} ошибок · в Module 1 — не больше ${scan.m1Max}`;

export const errorBudget = (target: number): ErrorBudget => {
  const half = target / 2;
  const rwScan = scanSectionBudget("rw", half);
  const mathScan = scanSectionBudget("math", half);
  const comboBest = comboMaxMistakes(target);

  const perSection: Record<SectionId, SectionBudget> = {
    rw: { total: rwScan.total, m1Max: rwScan.m1Max, note: noteFor("rw", rwScan) },
    math: { total: mathScan.total, m1Max: mathScan.m1Max, note: noteFor("math", mathScan) },
  };

  const low = rwScan.total + mathScan.total;

  return {
    perSection,
    reachable: comboBest !== null,
    totalRange: { low, high: comboBest ?? low },
  };
};
