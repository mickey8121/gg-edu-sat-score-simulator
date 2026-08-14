import { cn } from "@/lib/utils";

export type PanelProps = React.ComponentProps<"div">;

export const Panel = ({ className, ...props }: PanelProps) => {
  return (
    <div
      className={cn("rounded-lg border border-line bg-card p-7 shadow-soft", className)}
      {...props}
    />
  );
};
