import { PresetPills } from "@/components/simulator/preset-pills";
import type { Action } from "@/components/simulator/types";
import { RangeSlider } from "@/components/ui/range-slider";

export type TargetPickerProps = Omit<React.ComponentProps<"div">, "children"> & {
  target: number;
  dispatch: React.Dispatch<Action>;
};

const TARGET_PRESETS = [
  { value: 1300, label: "1300" },
  { value: 1400, label: "1400" },
  { value: 1500, label: "1500" },
];

export const TargetPicker = ({ className, target, dispatch, ...props }: TargetPickerProps) => {
  const setTarget = (value: number) => dispatch({ type: "SET_TARGET", value });

  return (
    <div className={className} {...props}>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor="target-slider" className="text-caption font-bold text-slate-600">
          Целевой балл
        </label>
        <span className="text-stat text-brand-deep tabular-nums">{target}</span>
      </div>
      <RangeSlider
        id="target-slider"
        min={400}
        max={1600}
        step={10}
        value={target}
        aria-valuetext={`${target} баллов`}
        onChange={(event) => setTarget(Number(event.target.value))}
      />
      <PresetPills className="mt-4" items={TARGET_PRESETS} active={target} onSelect={setTarget} />
    </div>
  );
};
