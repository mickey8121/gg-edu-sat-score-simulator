"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

import type { Action, AppState } from "@/components/simulator/types";
import { DEFAULT_STATE } from "@/components/simulator/url-state";
import { useUrlState } from "@/components/simulator/use-url-state";
import { ENGINE_CONFIG, scoreTotal, type TotalResult } from "@/lib/engine";

export interface SimulatorContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  labResult: TotalResult;
}

export type SimulatorProviderProps = { children: React.ReactNode };

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "SET_TAB":
      return { ...state, tab: action.tab };
    case "SET_MISTAKES": {
      const cfg = ENGINE_CONFIG[action.section];
      const max = action.module === "m1" ? cfg.m1Questions : cfg.m2Questions;
      const key = action.module === "m1" ? "m1Mistakes" : "m2Mistakes";
      const value = Math.min(max, Math.max(0, action.value));
      return {
        ...state,
        lab: { ...state.lab, [action.section]: { ...state.lab[action.section], [key]: value } },
      };
    }
    case "SET_TARGET":
      return { ...state, target: Math.min(1600, Math.max(400, Math.round(action.value / 10) * 10)) };
    default:
      return state;
  }
};

export const SimulatorProvider = ({ children }: SimulatorProviderProps) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  useUrlState(state, dispatch);

  const labResult = useMemo(() => scoreTotal(state.lab), [state.lab]);
  const value = useMemo(() => ({ state, dispatch, labResult }), [state, labResult]);

  return <SimulatorContext.Provider value={value}>{children}</SimulatorContext.Provider>;
};

export const useSimulator = (): SimulatorContextValue => {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator must be used within SimulatorProvider");
  return ctx;
};
