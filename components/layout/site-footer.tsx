import { cn } from "@/lib/utils";

export type SiteFooterProps = React.ComponentProps<"footer">;

export const SiteFooter = ({ className, ...props }: SiteFooterProps) => {
  return (
    <footer
      className={cn(
        "mt-12 border-t border-line pt-6 text-body-sm text-muted",
        "[&_strong]:text-slate-700",
        className,
      )}
      {...props}
    />
  );
};
