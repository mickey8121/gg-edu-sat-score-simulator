import type { AppState, SectionInputMap, TabId } from "@/components/simulator/types";
import { ENGINE_CONFIG } from "@/lib/engine";

export const DEFAULT_TAB: TabId = "sim";
export const DEFAULT_TARGET = 1400;

export const DEFAULT_LAB: SectionInputMap = {
  rw: { m1Mistakes: 0, m2Mistakes: 0 },
  math: { m1Mistakes: 0, m2Mistakes: 0 },
};

export const DEFAULT_STATE: AppState = { tab: DEFAULT_TAB, lab: DEFAULT_LAB, target: DEFAULT_TARGET };

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
    target: parseTarget(params.get("target")),
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
  if (state.target !== DEFAULT_STATE.target) params.set("target", String(state.target));

  return params.toString();
};
