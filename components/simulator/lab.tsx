import { LivePanel } from "@/components/simulator/live-panel";
import { SectionSliders } from "@/components/simulator/section-sliders";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { SmartAlert } from "@/components/simulator/smart-alert";
import { Cols } from "@/components/ui/layout-primitives";
import { Panel } from "@/components/ui/panel";

export const Lab = () => {
  const { state, dispatch, labResult } = useSimulator();

  return (
    <Panel className="mt-6">
      <Cols>
        <SectionSliders section="rw" input={state.lab.rw} dispatch={dispatch} />
        <SectionSliders section="math" input={state.lab.math} dispatch={dispatch} />
      </Cols>
      <LivePanel className="mt-6" result={labResult} />
      <SmartAlert className="mt-6" lab={state.lab} result={labResult} touched={state.labTouched} />
    </Panel>
  );
};
