import { cn } from "@/lib/utils";

export type HeroProps = React.ComponentProps<"header">;

export const Hero = ({ className, ...props }: HeroProps) => {
  return (
    <header
      className={cn(
        "rounded-xl border border-line bg-card p-7 shadow-soft sm:p-10",
        className,
      )}
      {...props}
    />
  );
};
