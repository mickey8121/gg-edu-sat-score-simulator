import { CompareBar } from "@/components/simulator/compare-bar";
import { LivePanel } from "@/components/simulator/live-panel";
import { ScenarioCardA } from "@/components/simulator/scenario-card-a";
import { SectionSliders } from "@/components/simulator/section-sliders";
import { ShareButton } from "@/components/simulator/share-button";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { SmartAlert } from "@/components/simulator/smart-alert";
import { Alert } from "@/components/ui/alert";
import { Cols, Row, Stack } from "@/components/ui/layout-primitives";
import { Panel } from "@/components/ui/panel";

export const Lab = () => {
  const { state, dispatch, labResult, frozenAResult } = useSimulator();
  const { frozenA } = state;

  return (
    <Panel id="panel-lab" role="tabpanel" aria-labelledby="tab-lab" className="mt-6">
      <Row className="justify-between">
        <CompareBar isComparing={frozenAResult !== null} dispatch={dispatch} />
        <ShareButton state={state} />
      </Row>
      {state.justTransferred && (
        <Alert tone="info" className="mt-4">
          Перенесли твой результат из симуляции
        </Alert>
      )}
      {frozenA && frozenAResult ? (
        <Cols className="mt-6">
          <ScenarioCardA input={frozenA} result={frozenAResult} />
          <Stack gap={6}>
            <Cols>
              <SectionSliders section="rw" input={state.lab.rw} dispatch={dispatch} />
              <SectionSliders section="math" input={state.lab.math} dispatch={dispatch} />
            </Cols>
            <LivePanel result={labResult} compareTo={frozenAResult} />
            <SmartAlert lab={state.lab} result={labResult} touched={state.labTouched} />
          </Stack>
        </Cols>
      ) : (
        <>
          <Cols className="mt-6">
            <SectionSliders section="rw" input={state.lab.rw} dispatch={dispatch} />
            <SectionSliders section="math" input={state.lab.math} dispatch={dispatch} />
          </Cols>
          <LivePanel className="mt-6" result={labResult} />
          <SmartAlert className="mt-6" lab={state.lab} result={labResult} touched={state.labTouched} />
        </>
      )}
    </Panel>
  );
};
