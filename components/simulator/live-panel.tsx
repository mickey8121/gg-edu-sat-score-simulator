import { MetricCard } from "@/components/simulator/metric-card";
import { RouteBadge } from "@/components/simulator/route-badge";
import { StatGrid } from "@/components/ui/stat-card";
import type { TotalResult } from "@/lib/engine";

export type LivePanelProps = Omit<React.ComponentProps<"div">, "children"> & { result: TotalResult };

export const LivePanel = ({ className, result, ...props }: LivePanelProps) => {
  return (
    <StatGrid className={className} {...props}>
      <MetricCard
        label="R&W"
        value={result.rw.score}
        low={result.rw.scoreLow}
        high={result.rw.scoreHigh}
        badge={<RouteBadge route={result.rw.route} />}
      />
      <MetricCard
        label="Math"
        value={result.math.score}
        low={result.math.scoreLow}
        high={result.math.scoreHigh}
        badge={<RouteBadge route={result.math.route} />}
      />
      <MetricCard
        label="Итого"
        value={result.total}
        low={result.totalLow}
        high={result.totalHigh}
        size="large"
      />
    </StatGrid>
  );
};
