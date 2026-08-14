import { Badge, type BadgeTone } from "@/components/ui/badge";

export type DeltaBadgeProps = Omit<React.ComponentProps<"span">, "children"> & {
  a: number;
  b: number;
};

export const DeltaBadge = ({ a, b, ...props }: DeltaBadgeProps) => {
  // a/b are each scenario's midpoint score (SectionResult.score / TotalResult.total),
  // already the center of that scenario's scoreLow–scoreHigh band. Diffing
  // scoreHigh/scoreLow instead of the centers would produce an asymmetric
  // delta near the score clamps (200/800 per section, 400/1600 total, the
  // easy-route cap) — don't "simplify" this to use the band edges.
  const delta = b - a;
  const tone: BadgeTone = delta > 0 ? "green" : delta < 0 ? "red" : "neutral";
  const label = delta > 0 ? `+${delta}` : delta < 0 ? `−${Math.abs(delta)}` : "0";

  return (
    <Badge tone={tone} {...props}>
      {label}
    </Badge>
  );
};
