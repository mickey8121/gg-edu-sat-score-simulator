import { cn } from "@/lib/utils";

export type EyebrowProps = React.ComponentProps<"span"> & { size?: "sm" | "md" };

export const Eyebrow = ({ className, size = "md", ...props }: EyebrowProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-brand-50 px-[13px] py-[7px]",
        "text-eyebrow text-brand-deep uppercase",
        size === "sm" && "text-micro font-extrabold tracking-[0.14em]",
        className,
      )}
      {...props}
    />
  );
};
