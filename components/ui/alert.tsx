import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export type AlertTone = NonNullable<VariantProps<typeof alertVariants>["tone"]>;

export type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    live?: "off" | "polite" | "assertive";
    icon?: React.ReactNode;
  };

export const alertVariants = cva(
  [
    "flex items-start gap-3",
    "rounded-md border px-4 py-3.5",
    "text-body-sm",
    "[&>svg]:mt-px [&>svg]:size-[19px] [&>svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        info: "border-brand-200 bg-brand-50 text-brand-deep",
        ok: "border-ok/28 bg-ok/8 text-ok-ink",
        warn: "border-warn/28 bg-warn/8 text-warn-ink",
        err: "border-err-line bg-err-surface text-err-ink",
      },
    },
    defaultVariants: { tone: "info" },
  },
);

const toneIcon: Record<AlertTone, React.ElementType> = {
  info: Info,
  ok: CircleCheck,
  warn: TriangleAlert,
  err: CircleAlert,
};

export const Alert = ({ className, tone = "info", live, icon, children, ...props }: AlertProps) => {
  const resolvedTone = tone ?? "info";
  const ToneIcon = toneIcon[resolvedTone];
  const resolvedLive = live ?? (resolvedTone === "err" ? "assertive" : "polite");
  // role="alert" with aria-live="off" is still announced on insert by some AT,
  // so "off" renders neither attribute.
  const liveProps =
    resolvedLive === "off"
      ? {}
      : { role: resolvedTone === "err" ? "alert" : "status", "aria-live": resolvedLive };

  return (
    <div className={cn(alertVariants({ tone: resolvedTone }), className)} {...liveProps} {...props}>
      {icon ?? <ToneIcon aria-hidden />}
      <div>{children}</div>
    </div>
  );
};
