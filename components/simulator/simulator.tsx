"use client";

import { FooterDisclaimer } from "@/components/simulator/footer-disclaimer";
import { Lab } from "@/components/simulator/lab";
import { SimulatorHeader } from "@/components/simulator/simulator-header";
import { SimulatorProvider, useSimulator } from "@/components/simulator/simulator-provider";
import { StepTabs } from "@/components/simulator/step-tabs";
import { Alert } from "@/components/ui/alert";
import { Panel } from "@/components/ui/panel";
import { StatCard } from "@/components/ui/stat-card";

// Placeholders only — replaced wholesale by Steps 4-5's real tab bodies.
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
  const { state, dispatch } = useSimulator();

  return (
    <>
      <SimulatorHeader />
      <StepTabs
        className="mt-6"
        tab={state.tab}
        onTabChange={(tab) => dispatch({ type: "SET_TAB", tab })}
      />
      {state.tab === "sim" && <SimPlaceholder />}
      {state.tab === "lab" && <Lab />}
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
