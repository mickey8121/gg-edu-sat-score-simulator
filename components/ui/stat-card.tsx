import { cn } from "@/lib/utils";

export type StatCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  value: React.ReactNode;
  label: React.ReactNode;
};

export type StatGridProps = React.ComponentProps<"div">;

export const StatCard = ({ className, value, label, ...props }: StatCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-card p-5 text-center shadow-soft",
        className,
      )}
      {...props}
    >
      <div className="text-stat text-brand-deep">{value}</div>
      <div className="mt-1 text-caption text-muted">{label}</div>
    </div>
  );
};

export const StatGrid = ({ className, ...props }: StatGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]",
        className,
      )}
      {...props}
    />
  );
};
