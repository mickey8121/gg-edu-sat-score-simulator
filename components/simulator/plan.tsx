import { useMemo } from "react";

import { BudgetCards } from "@/components/simulator/budget-cards";
import { PriorityBlock } from "@/components/simulator/priority-block";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { TargetPicker } from "@/components/simulator/target-picker";
import { Alert, type AlertTone } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button-link";
import { Panel } from "@/components/ui/panel";
import { errorBudget } from "@/lib/engine";
import { TRIAL_EXAM_URL } from "@/lib/site-config";

type EdgeAlert = { tone: AlertTone; message: string };

// !reachable, target===1600 and target<=800 never overlap by construction —
// see lib/engine/budget.ts: if both sections independently clear target/2 on
// the hard route, the combo scan always finds that same pair. Ordered
// most-severe-first anyway, in case future calibration loosens that guarantee.
const edgeAlert = (target: number, reachable: boolean): EdgeAlert | null => {
  if (!reachable) return { tone: "err", message: "Не смогли посчитать. Попробуй другую цель" };
  if (target === 1600) {
    return {
      tone: "warn",
      message: "1600 — это идеальный проход. Бюджета на ошибки нет, но диапазон прощает 1–2 в сильной секции",
    };
  }
  if (target <= 800) {
    return { tone: "info", message: "Такой балл даёт даже частичный проход — смело целься выше" };
  }
  return null;
};

export const Plan = () => {
  const { state, dispatch, labResult, simResultTotal } = useSimulator();
  const budget = useMemo(() => errorBudget(state.target), [state.target]);
  const alert = edgeAlert(state.target, budget.reachable);
  // labTouched wins even once a simulation has completed and simResult stays
  // truthy — otherwise editing the sandbox after a transfer would keep
  // showing the stale simulation-based recommendation instead of the live one.
  const priorityResult = state.labTouched ? labResult : simResultTotal;

  return (
    <Panel className="mt-6">
      <TargetPicker target={state.target} dispatch={dispatch} />
      {budget.reachable && <BudgetCards className="mt-6" budget={budget} />}
      {alert && (
        <Alert tone={alert.tone} className="mt-6">
          {alert.message}
        </Alert>
      )}
      <PriorityBlock className="mt-6" result={priorityResult} dispatch={dispatch} />
      <ButtonLink
        href={TRIAL_EXAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="lg"
        className="mt-6"
      >
        Проверить на пробном экзамене
      </ButtonLink>
    </Panel>
  );
};
