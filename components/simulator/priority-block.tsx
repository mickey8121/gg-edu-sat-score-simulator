import { describeTopPriority, isPerfectResult } from "@/components/simulator/priority-copy";
import type { Action } from "@/components/simulator/types";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { priorities, type TotalResult } from "@/lib/engine";

export type PriorityBlockProps = Omit<React.ComponentProps<"div">, "children"> & {
  result: TotalResult | null;
  dispatch: React.Dispatch<Action>;
};

export const PriorityBlock = ({ className, result, dispatch, ...props }: PriorityBlockProps) => {
  if (result) {
    // Nothing cost anything on a perfect run — no priority to recommend, and
    // no need to prompt a "go simulate" CTA the user has already acted on.
    const perfect = isPerfectResult(result);
    return (
      <Alert tone={perfect ? "ok" : "info"} className={className} {...props}>
        {perfect ? "Ошибок нет — подтягивать нечего" : describeTopPriority(priorities(result))}
      </Alert>
    );
  }

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
