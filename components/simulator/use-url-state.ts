"use client";

import { useEffect } from "react";

import type { Action, AppState } from "@/components/simulator/types";
import { parseSearch, serializeState } from "@/components/simulator/url-state";

const DEBOUNCE_MS = 300;

const buildUrl = (state: AppState): string => {
  const query = serializeState(state);
  const { origin, pathname } = window.location;
  return query ? `${origin}${pathname}?${query}` : `${origin}${pathname}`;
};

// Writes the URL bar immediately (bypassing the debounce below) and returns
// the full absolute URL — used by ShareButton so the clipboard never gets a
// 300ms-stale value while a slider drag's debounce timer is still pending.
export const flushUrl = (state: AppState): string => {
  const url = buildUrl(state);
  window.history.replaceState(null, "", url);
  return url;
};

export const useUrlState = (state: AppState, dispatch: React.Dispatch<Action>): void => {
  useEffect(() => {
    // dispatch is referentially stable for useReducer, so this effectively runs once on mount.
    dispatch({ type: "HYDRATE", state: parseSearch(window.location.search) });
  }, [dispatch]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      flushUrl(state);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [state]);
};
