import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { Route } from "@/lib/engine";

export type RouteBadgeProps = Omit<React.ComponentProps<"span">, "children"> & { route: Route };

const ROUTE_COPY: Record<Route, { tone: BadgeTone; label: string }> = {
  hard: { tone: "green", label: "Сложный модуль 2" },
  easy: { tone: "amber", label: "Лёгкий модуль 2" },
};

export const RouteBadge = ({ route, ...props }: RouteBadgeProps) => {
  const { tone, label } = ROUTE_COPY[route];
  return (
    <Badge tone={tone} dot {...props}>
      {label}
    </Badge>
  );
};
