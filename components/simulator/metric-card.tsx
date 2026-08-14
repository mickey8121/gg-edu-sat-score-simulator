import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

export type MetricCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  value: number;
  low: number;
  high: number;
  size?: "default" | "large";
  badge?: React.ReactNode;
};

export const MetricCard = ({
  className,
  label,
  value,
  low,
  high,
  size = "default",
  badge,
  ...props
}: MetricCardProps) => {
  return (
    <StatCard
      className={className}
      value={
        <span
          key={value}
          className={cn(
            "inline-block tabular-nums transition-[opacity,translate] duration-300 ease-out",
            "starting:opacity-0 starting:-translate-y-1",
            size === "large" && "text-display",
          )}
        >
          {value}
        </span>
      }
      label={
        <>
          <div>{label}</div>
          <div className="mt-0.5 text-micro text-slate-400">
            {low}–{high}
          </div>
          {badge && <div className="mt-2 flex justify-center">{badge}</div>}
        </>
      }
      {...props}
    />
  );
};
