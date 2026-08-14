import { cn } from "@/lib/utils";

export type ChipProps = React.ComponentProps<"span">;

export const Chip = ({ className, ...props }: ChipProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[7px] rounded-full border border-line bg-slate-50 px-[13px] py-2",
        "text-caption font-semibold text-slate-600",
        "[&>svg]:size-[15px] [&>svg]:shrink-0 [&>svg]:text-brand",
        className,
      )}
      {...props}
    />
  );
};
