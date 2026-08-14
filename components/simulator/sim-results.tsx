import { MetricCard } from "@/components/simulator/metric-card";
import { describeBiggestLoss, isPerfectResult } from "@/components/simulator/priority-copy";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout-primitives";
import { StatCard, StatGrid } from "@/components/ui/stat-card";
import { priorities } from "@/lib/engine";

export const SimResults = () => {
  const { simResultTotal, dispatch } = useSimulator();
  // Only rendered by sim-flow at simStep 7, where ADVANCE_SIM has already
  // frozen simResult — this guard is pure type narrowing, not a real branch.
  if (!simResultTotal) return null;

  const hardCount = [simResultTotal.rw.route, simResultTotal.math.route].filter(
    (route) => route === "hard",
  ).length;
  const perfect = isPerfectResult(simResultTotal);
  const biggestLoss = perfect ? null : describeBiggestLoss(priorities(simResultTotal));

  return (
    <Stack gap={6}>
      <StatGrid>
        <MetricCard
          label="R&W"
          value={simResultTotal.rw.score}
          low={simResultTotal.rw.scoreLow}
          high={simResultTotal.rw.scoreHigh}
        />
        <MetricCard
          label="Math"
          value={simResultTotal.math.score}
          low={simResultTotal.math.scoreLow}
          high={simResultTotal.math.scoreHigh}
        />
        <MetricCard
          label="Итого"
          value={simResultTotal.total}
          low={simResultTotal.totalLow}
          high={simResultTotal.totalHigh}
          size="large"
        />
        <StatCard value={`${hardCount}/2`} label="Сложных маршрутов" />
      </StatGrid>
      {perfect && <Alert tone="ok">Идеальный проход. На реальном экзамене так же?</Alert>}
      {biggestLoss && <Alert tone="info">{biggestLoss}</Alert>}
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" size="lg" onClick={() => dispatch({ type: "TRANSFER_SIM_TO_LAB" })}>
          Покрутить в песочнице
        </Button>
        <Button variant="outline" size="lg" onClick={() => dispatch({ type: "RESET_SIM" })}>
          Пройти ещё раз
        </Button>
      </div>
    </Stack>
  );
};
