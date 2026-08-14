import { LivePanel } from "@/components/simulator/live-panel";
import type { SectionInputMap } from "@/components/simulator/types";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Panel } from "@/components/ui/panel";
import type { TotalResult } from "@/lib/engine";
import { cn } from "@/lib/utils";

export type ScenarioCardAProps = Omit<React.ComponentProps<"div">, "children"> & {
  input: SectionInputMap;
  result: TotalResult;
};

export const ScenarioCardA = ({ className, input, result, ...props }: ScenarioCardAProps) => {
  return (
    <Panel className={cn("bg-slate-50", className)} {...props}>
      <Eyebrow size="sm">Сценарий A · заморожен</Eyebrow>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-caption text-muted">
        <dt className="font-bold text-slate-600">R&W</dt>
        <dd>
          {input.rw.m1Mistakes} ошибок в M1, {input.rw.m2Mistakes} в M2
        </dd>
        <dt className="font-bold text-slate-600">Math</dt>
        <dd>
          {input.math.m1Mistakes} ошибок в M1, {input.math.m2Mistakes} в M2
        </dd>
      </dl>
      <LivePanel className="mt-4" result={result} />
    </Panel>
  );
};
