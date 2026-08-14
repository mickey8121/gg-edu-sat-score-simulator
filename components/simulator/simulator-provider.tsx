"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

import type { Action, AppState } from "@/components/simulator/types";
import { DEFAULT_SIM_DRAFT, DEFAULT_STATE } from "@/components/simulator/url-state";
import { useUrlState } from "@/components/simulator/use-url-state";
import { ENGINE_CONFIG, scoreTotal, type SectionId, type TotalResult } from "@/lib/engine";

export interface SimulatorContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  labResult: TotalResult;
  // Live, ticks on every simDraft edit — drives in-walkthrough UI (M2 route,
  // routing-reveal verdict). Not the same thing as simResultTotal below.
  simTotal: TotalResult;
  // Only recomputes on freeze/reset — drives the frozen results screen.
  // simDraft === simResult once frozen, but reading the wrong one signals
  // the wrong intent to the next reader.
  simResultTotal: TotalResult | null;
  frozenAResult: TotalResult | null;
}

export type SimulatorProviderProps = { children: React.ReactNode };

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

const clampMistakes = (section: SectionId, module: "m1" | "m2", value: number): number => {
  const cfg = ENGINE_CONFIG[section];
  const max = module === "m1" ? cfg.m1Questions : cfg.m2Questions;
  return Math.min(max, Math.max(0, value));
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "SET_TAB":
      return { ...state, tab: action.tab };
    case "SET_MISTAKES": {
      const value = clampMistakes(action.section, action.module, action.value);
      const key = action.module === "m1" ? "m1Mistakes" : "m2Mistakes";
      return {
        ...state,
        labTouched: true,
        justTransferred: false, // any edit invalidates "this came straight from the sim"
        lab: { ...state.lab, [action.section]: { ...state.lab[action.section], [key]: value } },
      };
    }
    case "SET_TARGET":
      return { ...state, target: Math.min(1600, Math.max(400, Math.round(action.value / 10) * 10)) };
    case "ADVANCE_SIM": {
      const simStep = Math.min(7, state.simStep + 1);
      return { ...state, simStep, simResult: simStep === 7 ? state.simDraft : state.simResult };
    }
    case "SET_SIM_MISTAKES": {
      const value = clampMistakes(action.section, action.module, action.value);
      const key = action.module === "m1" ? "m1Mistakes" : "m2Mistakes";
      return {
        ...state,
        simDraft: { ...state.simDraft, [action.section]: { ...state.simDraft[action.section], [key]: value } },
      };
    }
    case "RESET_SIM":
      return { ...state, simStep: 0, simDraft: DEFAULT_SIM_DRAFT, simResult: null };
    case "TRANSFER_SIM_TO_LAB":
      // simResult can't be transferred until it exists — the CTA that fires
      // this is only rendered on the results screen, where it always does.
      return state.simResult
        ? {
            ...state,
            lab: state.simResult,
            tab: "lab",
            labTouched: true,
            justTransferred: true,
            frozenA: null, // a fresh transfer invalidates any stale A/B comparison
          }
        : state;
    case "FREEZE_COMPARE":
      // Also backs CompareBar's "Поменять местами" — re-anchoring B as the
      // new A is the same operation as first entering compare mode: snapshot
      // the live scenario into frozenA.
      return { ...state, frozenA: state.lab };
    case "EXIT_COMPARE":
      return { ...state, frozenA: null };
    default:
      return state;
  }
};

export const SimulatorProvider = ({ children }: SimulatorProviderProps) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  useUrlState(state, dispatch);

  const labResult = useMemo(() => scoreTotal(state.lab), [state.lab]);
  const simTotal = useMemo(() => scoreTotal(state.simDraft), [state.simDraft]);
  const simResultTotal = useMemo(
    () => (state.simResult ? scoreTotal(state.simResult) : null),
    [state.simResult],
  );
  const frozenAResult = useMemo(
    () => (state.frozenA ? scoreTotal(state.frozenA) : null),
    [state.frozenA],
  );
  const value = useMemo(
    () => ({ state, dispatch, labResult, simTotal, simResultTotal, frozenAResult }),
    [state, labResult, simTotal, simResultTotal, frozenAResult],
  );

  return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>;
};

export const useSimulator = (): SimulatorContextValue => {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used within SimulatorProvider");
  return ctx;
};
