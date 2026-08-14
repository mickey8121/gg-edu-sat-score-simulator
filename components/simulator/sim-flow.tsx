import { useEffect, useRef } from "react";

import { ModuleStep } from "@/components/simulator/module-step";
import { RoutingReveal } from "@/components/simulator/routing-reveal";
import { SimIntro } from "@/components/simulator/sim-intro";
import { SimProgress } from "@/components/simulator/sim-progress";
import { SimResults } from "@/components/simulator/sim-results";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { Panel } from "@/components/ui/panel";

const renderStep = (simStep: number): React.ReactNode => {
  switch (simStep) {
    case 0:
      return <SimIntro />;
    case 1:
      return <ModuleStep section="rw" module="m1" />;
    case 2:
      return <RoutingReveal section="rw" />;
    case 3:
      return <ModuleStep section="rw" module="m2" />;
    case 4:
      return <ModuleStep section="math" module="m1" />;
    case 5:
      return <RoutingReveal section="math" />;
    case 6:
      return <ModuleStep section="math" module="m2" />;
    case 7:
      return <SimResults />;
    default:
      return null;
  }
};

export const SimFlow = () => {
  const { state } = useSimulator();
  const panelRef = useRef<HTMLDivElement>(null);
  // RoutingReveal manages its own focus (moves it to "Дальше" once the
  // verdict lands) — don't fight it by also focusing the panel on those steps.
  const isReveal = state.simStep === 2 || state.simStep === 5;

  useEffect(() => {
    if (isReveal) return;
    panelRef.current?.focus({ preventScroll: true });
  }, [state.simStep, isReveal]);

  return (
    <Panel
      ref={panelRef}
      id="panel-sim"
      role="tabpanel"
      aria-labelledby="tab-sim"
      tabIndex={-1}
      className="mt-6 outline-none"
    >
      {state.simStep > 0 && <SimProgress currentStep={state.simStep} className="mb-6" />}
      {renderStep(state.simStep)}
    </Panel>
  );
};
