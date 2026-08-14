import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout-primitives";
import { cn } from "@/lib/utils";

export type PresetPillsProps = Omit<React.ComponentProps<"div">, "children" | "onSelect"> & {
  items: { value: number; label: React.ReactNode }[];
  active: number;
  onSelect: (value: number) => void;
};

export const PresetPills = ({ className, items, active, onSelect, ...props }: PresetPillsProps) => {
  return (
    <Row className={className} {...props}>
      {items.map((item) => (
        <Button
          key={item.value}
          variant="outline"
          size="sm"
          aria-pressed={item.value === active}
          onClick={() => onSelect(item.value)}
          className={cn("rounded-full", item.value === active && "border-brand bg-brand-50 text-brand-deep")}
        >
          {item.label}
        </Button>
      ))}
    </Row>
  );
};
