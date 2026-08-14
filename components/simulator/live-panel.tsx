import { DeltaBadge } from "@/components/simulator/delta-badge";
import { MetricCard } from "@/components/simulator/metric-card";
import { RouteBadge } from "@/components/simulator/route-badge";
import { StatGrid } from "@/components/ui/stat-card";
import type { TotalResult } from "@/lib/engine";

export type LivePanelProps = Omit<React.ComponentProps<"div">, "children"> & {
  result: TotalResult;
  compareTo?: TotalResult;
};

export const LivePanel = ({ className, result, compareTo, ...props }: LivePanelProps) => {
  return (
    <StatGrid className={className} {...props}>
      <MetricCard
        label="R&W"
        value={result.rw.score}
        low={result.rw.scoreLow}
        high={result.rw.scoreHigh}
        badge={
          <span className="inline-flex items-center gap-2">
            <RouteBadge route={result.rw.route} />
            {compareTo && <DeltaBadge a={compareTo.rw.score} b={result.rw.score} />}
          </span>
        }
      />
      <MetricCard
        label="Math"
        value={result.math.score}
        low={result.math.scoreLow}
        high={result.math.scoreHigh}
        badge={
          <span className="inline-flex items-center gap-2">
            <RouteBadge route={result.math.route} />
            {compareTo && <DeltaBadge a={compareTo.math.score} b={result.math.score} />}
          </span>
        }
      />
      <MetricCard
        label="Итого"
        value={result.total}
        low={result.totalLow}
        high={result.totalHigh}
        size="large"
        badge={compareTo ? <DeltaBadge a={compareTo.total} b={result.total} /> : undefined}
      />
    </StatGrid>
  );
};
