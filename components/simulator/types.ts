import type { SectionId, SectionInput } from "@/lib/engine";

export type TabId = "sim" | "lab" | "plan";

// Same Record<SectionId, SectionInput> shape the full spec's AppState reuses
// for `lab`, `frozenA` (step 6), and `simResult` (step 5).
export type SectionInputMap = Record<SectionId, SectionInput>;

export interface AppState {
  tab: TabId;
  lab: SectionInputMap;
  // Session-only UX flag for SmartAlert's default hint; never URL-persisted.
  labTouched: boolean;
  target: number;
  simStep: number; // 0..7, never URL-persisted — a refresh restarts the walkthrough
  simDraft: SectionInputMap; // in-progress answers, mistakes-framed like `lab`
  simResult: SectionInputMap | null; // frozen copy of simDraft, set once simStep reaches 7
}

export type Action =
  | { type: "HYDRATE"; state: AppState }
  | { type: "SET_TAB"; tab: TabId }
  | { type: "SET_MISTAKES"; section: SectionId; module: "m1" | "m2"; value: number }
  | { type: "SET_TARGET"; value: number }
  | { type: "ADVANCE_SIM" }
  | { type: "SET_SIM_MISTAKES"; section: SectionId; module: "m1" | "m2"; value: number }
  | { type: "RESET_SIM" }
  | { type: "TRANSFER_SIM_TO_LAB" };
