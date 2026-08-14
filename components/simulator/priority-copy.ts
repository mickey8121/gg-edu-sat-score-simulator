import type { Priority, PriorityKind, SectionId, TotalResult } from "@/lib/engine";

export const SECTION_LABEL: Record<SectionId, string> = { rw: "R&W", math: "Math" };

// The anchor curves in lib/engine/config.ts only reach score 800 at 0 total
// mistakes for either section — a TotalResult-only proxy for "perfect run",
// usable where the raw mistake counts aren't available (the plan tab only
// ever sees a TotalResult, never simResult's raw SectionInputMap).
export const isPerfectResult = (result: TotalResult): boolean =>
  result.rw.score === 800 && result.math.score === 800;

export const describeTopPriority = (priorities: Priority[]): string => {
  const top = priorities[0];
  return `Начни с ${SECTION_LABEL[top.section]} — там ошибки стоят дороже всего`;
};

// route-lost/threshold-risk both name Module 1 — the route is decided by M1
// alone, so that attribution is defensible. steep-curve doesn't: Priority
// carries no module-level data, and the marginal cost it's ranked on could
// come from either module, so its copy stays section-only.
const RESULTS_COPY: Record<PriorityKind, (section: string) => string> = {
  "route-lost": (section) =>
    `Ошибки в ${section} Module 1 стоили тебе дороже всего — они увели тебя на лёгкий маршрут.`,
  "threshold-risk": (section) =>
    `Ошибки в ${section} Module 1 стоили тебе дороже всего — они чуть не сбросили маршрут.`,
  "steep-curve": (section) => `Ошибки в ${section} стоили тебе дороже всего.`,
};

export const describeBiggestLoss = (priorities: Priority[]): string => {
  const top = priorities[0];
  return RESULTS_COPY[top.kind](SECTION_LABEL[top.section]);
};
