import type { Action } from "@/components/simulator/types";
import { Stack } from "@/components/ui/layout-primitives";
import { RangeSlider } from "@/components/ui/range-slider";
import { ENGINE_CONFIG, type SectionId, type SectionInput } from "@/lib/engine";

export type SectionSlidersProps = {
  section: SectionId;
  input: SectionInput;
  dispatch: React.Dispatch<Action>;
};

const SECTION_LABEL: Record<SectionId, string> = { rw: "R&W", math: "Math" };

export const mistakesWord = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "ошибка";
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "ошибки";
  return "ошибок";
};

export const SectionSliders = ({ section, input, dispatch }: SectionSlidersProps) => {
  const cfg = ENGINE_CONFIG[section];
  // Route flips between the last-hard and first-easy mistake count; the tick
  // sits on the boundary between them, not on either thumb position.
  const threshold = cfg.m1Questions - cfg.routingThreshold + 0.5;

  return (
    <div>
      <h3 className="text-card-title text-ink">{SECTION_LABEL[section]}</h3>
      <Stack gap={4} className="mt-4">
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor={`${section}-m1`} className="text-caption font-bold text-slate-600">
              Module 1
            </label>
            <span className="text-caption text-muted">
              {input.m1Mistakes} {mistakesWord(input.m1Mistakes)}
            </span>
          </div>
          <RangeSlider
            id={`${section}-m1`}
            min={0}
            max={cfg.m1Questions}
            value={input.m1Mistakes}
            marker={{ value: threshold, label: "порог сложного модуля" }}
            aria-valuetext={`${input.m1Mistakes} из ${cfg.m1Questions}`}
            onChange={(event) =>
              dispatch({
                type: "SET_MISTAKES",
                section,
                module: "m1",
                value: Number(event.target.value),
              })
            }
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <label htmlFor={`${section}-m2`} className="text-caption font-bold text-slate-600">
              Module 2
            </label>
            <span className="text-caption text-muted">
              {input.m2Mistakes} {mistakesWord(input.m2Mistakes)}
            </span>
          </div>
          <RangeSlider
            id={`${section}-m2`}
            min={0}
            max={cfg.m2Questions}
            value={input.m2Mistakes}
            aria-valuetext={`${input.m2Mistakes} из ${cfg.m2Questions}`}
            onChange={(event) =>
              dispatch({
                type: "SET_MISTAKES",
                section,
                module: "m2",
                value: Number(event.target.value),
              })
            }
          />
        </div>
      </Stack>
    </div>
  );
};
