import type { Action } from "@/components/simulator/types";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/ui/layout-primitives";

export type CompareBarProps = {
  isComparing: boolean;
  dispatch: React.Dispatch<Action>;
};

export const CompareBar = ({ isComparing, dispatch }: CompareBarProps) => {
  if (!isComparing) {
    return (
      <Button variant="secondary" onClick={() => dispatch({ type: "FREEZE_COMPARE" })}>
        Сравнить сценарии
      </Button>
    );
  }

  return (
    <Row className="gap-2">
      <Button variant="secondary" onClick={() => dispatch({ type: "FREEZE_COMPARE" })}>
        Поменять местами
      </Button>
      <Button variant="outline" onClick={() => dispatch({ type: "EXIT_COMPARE" })}>
        Выйти из сравнения
      </Button>
    </Row>
  );
};
