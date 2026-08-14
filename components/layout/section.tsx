import { cn } from "@/lib/utils";

export type SectionProps = React.ComponentProps<"section">;

export const Section = ({ className, ...props }: SectionProps) => {
  return <section className={cn("mb-14 scroll-mt-20", className)} {...props} />;
};
