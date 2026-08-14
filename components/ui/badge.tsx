import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type BadgeTone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

export type StatusDotProps = React.ComponentProps<"span"> & { tone?: BadgeTone };

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { dot?: boolean };

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-[5px]",
    "rounded-full px-2.5 py-1",
    "text-badge",
    "[&>svg]:size-[14px] [&>svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        blue: "bg-brand/10 text-brand-deep",
        green: "bg-ok/12 text-ok-ink",
        amber: "bg-warn/14 text-warn-ink",
        red: "bg-err/12 text-err-ink",
        neutral: "bg-slate-100 text-slate-600",
        outline: "border border-line bg-white text-slate-600",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

const dotTone: Record<BadgeTone, string> = {
  blue: "bg-brand",
  green: "bg-ok",
  amber: "bg-warn",
  red: "bg-err",
  neutral: "bg-slate-400",
  outline: "bg-slate-400",
};

export const StatusDot =({ className, tone = "neutral", ...props }: StatusDotProps) => {
  return (
    <span
      aria-hidden
      className={cn("size-2 shrink-0 rounded-full", dotTone[tone], className)}
      {...props}
    />
  );
};

export const Badge =({ className, tone, dot = false, children, ...props }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? <StatusDot tone={tone ?? "neutral"} /> : null}
      {children}
    </span>
  );
};
