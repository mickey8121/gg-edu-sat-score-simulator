import type { SectionId, SectionInput } from "@/lib/engine";

export type TabId = "sim" | "lab" | "plan";

// Same Record<SectionId, SectionInput> shape the full spec's AppState reuses
// for `lab`, `frozenA` (step 6), and `simResult` (step 5).
export type SectionInputMap = Record<SectionId, SectionInput>;

export interface AppState {
  tab: TabId;
  lab: SectionInputMap;
  target: number;
}

export type Action =
  | { type: "HYDRATE"; state: AppState }
  | { type: "SET_TAB"; tab: TabId }
  | { type: "SET_MISTAKES"; section: SectionId; module: "m1" | "m2"; value: number }
  | { type: "SET_TARGET"; value: number };
