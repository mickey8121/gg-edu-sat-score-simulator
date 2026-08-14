import { Play } from "lucide-react";

import { useSimulator } from "@/components/simulator/simulator-provider";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout-primitives";

export const SimIntro = () => {
  const { dispatch } = useSimulator();

  return (
    <Stack gap={6}>
      <p className="max-w-[560px] text-body text-ink">
        Пройди структуру экзамена за минуту. Без вопросов — только механика: два модуля, развилка,
        балл.
      </p>
      <Button
        variant="primary"
        size="lg"
        className="self-start"
        onClick={() => dispatch({ type: "ADVANCE_SIM" })}
      >
        <Play aria-hidden />
        Начать
      </Button>
    </Stack>
  );
};
