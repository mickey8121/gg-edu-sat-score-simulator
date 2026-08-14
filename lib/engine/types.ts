export type SectionId = "rw" | "math";
export type Route = "hard" | "easy";
export type PriorityKind = "route-lost" | "threshold-risk" | "steep-curve";

export interface SectionInput {
  m1Mistakes: number;
  m2Mistakes: number;
}

export interface SectionResult {
  route: Route;
  score: number;
  scoreLow: number;
  scoreHigh: number;
  // m1Correct - threshold + 1: mistakes left in Module 1 before losing the
  // hard route; exactly 1 at the threshold, ≤0 means already on easy.
  distanceToThreshold: number;
  // points lost to the single worst next mistake (M1 or M2, whichever costs more)
  marginalCost: number;
}

export interface TotalResult {
  rw: SectionResult;
  math: SectionResult;
  total: number;
  totalLow: number;
  totalHigh: number;
}

export interface SectionBudget {
  total: number;
  m1Max: number;
  note: string;
}

export interface ErrorBudget {
  perSection: Record<SectionId, SectionBudget>;
  reachable: boolean;
  totalRange: { low: number; high: number };
}

export interface Priority {
  kind: PriorityKind;
  section: SectionId;
  weight: number;
  distanceToThreshold: number;
  marginalCost: number;
}
