import { cn } from "@/lib/utils";

type ProgressBase = Omit<React.ComponentProps<"div">, "children"> & { value: number };

export type ProgressProps = ProgressBase &
  ({ label: string } | { label?: React.ReactNode; "aria-label": string });

export const Progress = ({ className, value, ...props }: ProgressProps) => {
  const { label, ...rest } = props as ProgressBase & { label?: React.ReactNode };
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={typeof label === "string" ? label : undefined}
      className={cn("h-2 overflow-hidden rounded-full bg-slate-100", className)}
      {...rest}
    >
      <div className="h-full rounded-full gradient-brand" style={{ width: `${clamped}%` }} />
    </div>
  );
};
