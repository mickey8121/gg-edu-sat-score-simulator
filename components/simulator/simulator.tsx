"use client";

import { FooterDisclaimer } from "@/components/simulator/footer-disclaimer";
import { SimulatorHeader } from "@/components/simulator/simulator-header";
import { SimulatorProvider, useSimulator } from "@/components/simulator/simulator-provider";
import { StepTabs } from "@/components/simulator/step-tabs";
import type { SectionInputMap } from "@/components/simulator/types";
import { Alert } from "@/components/ui/alert";
import { Panel } from "@/components/ui/panel";
import { StatCard, StatGrid } from "@/components/ui/stat-card";
import type { TotalResult } from "@/lib/engine";

// Placeholders only — replaced wholesale by Steps 3-5's real tab bodies.
// Not separate files: not in Step 2's file list, throwaway by design.
const SimPlaceholder = () => {
  return (
    <Panel className="mt-6">
      <Alert tone="info" live="off">
        TODO Step 5 — симуляция (stepper not built yet).
      </Alert>
    </Panel>
  );
};

const LabPlaceholder = ({ lab, labResult }: { lab: SectionInputMap; labResult: TotalResult }) => {
  return (
    <Panel className="mt-6">
      <Alert tone="info" live="off">
        TODO Step 3 — sandbox sliders not built yet.
      </Alert>
      <StatGrid className="mt-5">
        <StatCard
          value={`${labResult.total}`}
          label={`Total (${labResult.totalLow}–${labResult.totalHigh})`}
        />
        <StatCard value={`${lab.rw.m1Mistakes}/${lab.rw.m2Mistakes}`} label="R&W mistakes M1/M2" />
        <StatCard
          value={`${lab.math.m1Mistakes}/${lab.math.m2Mistakes}`}
          label="Math mistakes M1/M2"
        />
      </StatGrid>
    </Panel>
  );
};

const PlanPlaceholder = ({ target }: { target: number }) => {
  return (
    <Panel className="mt-6">
      <Alert tone="info" live="off">
        TODO Step 4 — target picker not built yet.
      </Alert>
      <StatCard className="mt-5" value={`${target}`} label="Target (from URL)" />
    </Panel>
  );
};

const SimulatorContent = () => {
  const { state, dispatch, labResult } = useSimulator();

  return (
    <>
      <SimulatorHeader />
      <StepTabs
        className="mt-6"
        tab={state.tab}
        onTabChange={(tab) => dispatch({ type: "SET_TAB", tab })}
      />
      {state.tab === "sim" && <SimPlaceholder />}
      {state.tab === "lab" && <LabPlaceholder lab={state.lab} labResult={labResult} />}
      {state.tab === "plan" && <PlanPlaceholder target={state.target} />}
      <FooterDisclaimer />
    </>
  );
};

export const Simulator = () => {
  return (
    <SimulatorProvider>
      <SimulatorContent />
    </SimulatorProvider>
  );
};
