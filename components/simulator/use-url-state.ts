"use client";

import { useEffect } from "react";

import type { Action, AppState } from "@/components/simulator/types";
import { parseSearch, serializeState } from "@/components/simulator/url-state";

const DEBOUNCE_MS = 300;

export const useUrlState = (state: AppState, dispatch: React.Dispatch<Action>): void => {
  useEffect(() => {
    // dispatch is referentially stable for useReducer, so this effectively runs once on mount.
    dispatch({ type: "HYDRATE", state: parseSearch(window.location.search) });
  }, [dispatch]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const query = serializeState(state);
      const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [state]);
};
