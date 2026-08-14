import { cn } from "@/lib/utils";

export type SubLabelProps = React.ComponentProps<"div">;

export type GradientTextProps = React.ComponentProps<"span">;

export type InlineCodeProps = React.ComponentProps<"code">;

export type TextLinkProps = React.ComponentProps<"a"> & { external?: boolean };

export const SubLabel = ({ className, ...props }: SubLabelProps) => {
  return (
    <div
      className={cn("mt-[26px] mb-3.5 text-sub text-slate-400 uppercase first:mt-0", className)}
      {...props}
    />
  );
};

export const GradientText = ({ className, ...props }: GradientTextProps) => {
  return <span className={cn("text-gradient-hero", className)} {...props} />;
};

export const InlineCode = ({ className, ...props }: InlineCodeProps) => {
  return <code className={className} {...props} />;
};

export const TextLink = ({ className, external = false, children, ...props }: TextLinkProps) => {
  return (
    <a
      className={cn("text-brand-deep hover:underline", className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
};
