import type { Action } from "@/components/simulator/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export type PriorityBlockProps = Omit<React.ComponentProps<"div">, "children"> & {
  active: boolean;
  dispatch: React.Dispatch<Action>;
};

export const PriorityBlock = ({ className, active, dispatch, ...props }: PriorityBlockProps) => {
  if (active) return null;

  return (
    <div className={className} {...props}>
      <Alert tone="info">Пройди симуляцию — подскажем, что подтянуть первым</Alert>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3"
        onClick={() => dispatch({ type: "SET_TAB", tab: "sim" })}
      >
        Перейти к симуляции
      </Button>
    </div>
  );
};
