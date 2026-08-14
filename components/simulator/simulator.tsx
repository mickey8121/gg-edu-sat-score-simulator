"use client";

import { FooterDisclaimer } from "@/components/simulator/footer-disclaimer";
import { Lab } from "@/components/simulator/lab";
import { Plan } from "@/components/simulator/plan";
import { SimFlow } from "@/components/simulator/sim-flow";
import { SimulatorHeader } from "@/components/simulator/simulator-header";
import { SimulatorProvider, useSimulator } from "@/components/simulator/simulator-provider";
import { StepTabs } from "@/components/simulator/step-tabs";

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
      {state.tab === "sim" && <SimFlow />}
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
