import type { AppState, SectionInputMap, TabId } from "@/components/simulator/types";
import { ENGINE_CONFIG } from "@/lib/engine";

export const DEFAULT_TAB: TabId = "sim";
export const DEFAULT_TARGET = 1400;

export const DEFAULT_LAB: SectionInputMap = {
  rw: { m1Mistakes: 0, m2Mistakes: 0 },
  math: { m1Mistakes: 0, m2Mistakes: 0 },
};

export const DEFAULT_SIM_DRAFT: SectionInputMap = {
  rw: { m1Mistakes: 0, m2Mistakes: 0 },
  math: { m1Mistakes: 0, m2Mistakes: 0 },
};

export const DEFAULT_STATE: AppState = {
  tab: DEFAULT_TAB,
  lab: DEFAULT_LAB,
  labTouched: false,
  target: DEFAULT_TARGET,
  simStep: 0,
  simDraft: DEFAULT_SIM_DRAFT,
  simResult: null,
  frozenA: null,
  justTransferred: false,
};

const TAB_IDS: TabId[] = ["sim", "lab", "plan"];

const parseTab = (raw: string | null): TabId => {
  return TAB_IDS.includes(raw as TabId) ? (raw as TabId) : DEFAULT_TAB;
};

const parseMistakes = (raw: string | null, max: number): number => {
  if (!raw) return 0;
  const value = Number(raw);
  if (!Number.isFinite(value)) return 0;
  return Math.min(max, Math.max(0, Math.round(value)));
};

const parseTarget = (raw: string | null): number => {
  if (!raw) return DEFAULT_TARGET;
  const value = Number(raw);
  if (!Number.isFinite(value)) return DEFAULT_TARGET;
  return Math.min(1600, Math.max(400, Math.round(value / 10) * 10));
};

// "a" is 4 dot-joined mistake counts: rw1.rw2.ma1.ma2. Any shape mismatch —
// wrong part count, a non-numeric part — falls back to "not comparing"
// entirely rather than partially trusting a malformed value.
const parseFrozenA = (raw: string | null): SectionInputMap | null => {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 4) return null;
  if (!parts.every((part) => part !== "" && Number.isFinite(Number(part)))) return null;

  const [rw1, rw2, ma1, ma2] = parts;
  return {
    rw: {
      m1Mistakes: parseMistakes(rw1, ENGINE_CONFIG.rw.m1Questions),
      m2Mistakes: parseMistakes(rw2, ENGINE_CONFIG.rw.m2Questions),
    },
    math: {
      m1Mistakes: parseMistakes(ma1, ENGINE_CONFIG.math.m1Questions),
      m2Mistakes: parseMistakes(ma2, ENGINE_CONFIG.math.m2Questions),
    },
  };
};

export const parseSearch = (search: string): AppState => {
  const params = new URLSearchParams(search);

  return {
    tab: parseTab(params.get("tab")),
    lab: {
      rw: {
        m1Mistakes: parseMistakes(params.get("rw1"), ENGINE_CONFIG.rw.m1Questions),
        m2Mistakes: parseMistakes(params.get("rw2"), ENGINE_CONFIG.rw.m2Questions),
      },
      math: {
        m1Mistakes: parseMistakes(params.get("ma1"), ENGINE_CONFIG.math.m1Questions),
        m2Mistakes: parseMistakes(params.get("ma2"), ENGINE_CONFIG.math.m2Questions),
      },
    },
    // Always false on (re)hydrate — never read from the URL.
    labTouched: false,
    frozenA: parseFrozenA(params.get("a")),
    target: parseTarget(params.get("target")),
    // The walkthrough is never URL-persisted — a refresh always restarts it,
    // even if `?tab=sim` is in the URL.
    simStep: 0,
    simDraft: DEFAULT_SIM_DRAFT,
    simResult: null,
    justTransferred: false,
  };
};

export const serializeState = (state: AppState): string => {
  const params = new URLSearchParams();

  if (state.tab !== DEFAULT_STATE.tab) params.set("tab", state.tab);
  if (state.lab.rw.m1Mistakes !== DEFAULT_STATE.lab.rw.m1Mistakes) {
    params.set("rw1", String(state.lab.rw.m1Mistakes));
  }
  if (state.lab.rw.m2Mistakes !== DEFAULT_STATE.lab.rw.m2Mistakes) {
    params.set("rw2", String(state.lab.rw.m2Mistakes));
  }
  if (state.lab.math.m1Mistakes !== DEFAULT_STATE.lab.math.m1Mistakes) {
    params.set("ma1", String(state.lab.math.m1Mistakes));
  }
  if (state.lab.math.m2Mistakes !== DEFAULT_STATE.lab.math.m2Mistakes) {
    params.set("ma2", String(state.lab.math.m2Mistakes));
  }
  if (state.frozenA) {
    params.set(
      "a",
      [
        state.frozenA.rw.m1Mistakes,
        state.frozenA.rw.m2Mistakes,
        state.frozenA.math.m1Mistakes,
        state.frozenA.math.m2Mistakes,
      ].join("."),
    );
  }
  if (state.target !== DEFAULT_STATE.target) params.set("target", String(state.target));

  return params.toString();
};
