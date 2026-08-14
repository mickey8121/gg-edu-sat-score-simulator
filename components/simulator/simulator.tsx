"use client";

import { FooterDisclaimer } from "@/components/simulator/footer-disclaimer";
import { Lab } from "@/components/simulator/lab";
import { Plan } from "@/components/simulator/plan";
import { SimulatorHeader } from "@/components/simulator/simulator-header";
import { SimulatorProvider, useSimulator } from "@/components/simulator/simulator-provider";
import { StepTabs } from "@/components/simulator/step-tabs";
import { Alert } from "@/components/ui/alert";
import { Panel } from "@/components/ui/panel";

// Placeholder only — replaced wholesale by Step 5's real tab body.
// Not a separate file: not in Step 2's file list, throwaway by design.
const SimPlaceholder = () => {
  return (
    <Panel className="mt-6">
      <Alert tone="info" live="off">
        TODO Step 5 — симуляция (stepper not built yet).
      </Alert>
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
      {state.tab === "plan" && <Plan />}
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
