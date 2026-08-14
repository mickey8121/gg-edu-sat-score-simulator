import { cn } from "@/lib/utils";

export type RangeSliderMarker = { value: number; label: string };

export type RangeSliderProps = Omit<React.ComponentProps<"input">, "type" | "min" | "max"> & {
  min: number;
  max: number;
  marker?: RangeSliderMarker;
};

const THUMB = [
  "[&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-[18px]",
  "[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2",
  "[&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:shadow-card",
  "[&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:cursor-pointer",
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2",
  "[&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-white",
  "[&::-moz-range-thumb]:shadow-card",
];

const TRACK = [
  "[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full",
  "[&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent",
];

export const RangeSlider = ({
  className,
  min,
  max,
  marker,
  style,
  value,
  defaultValue,
  ...props
}: RangeSliderProps) => {
  const current = Number(value ?? defaultValue ?? min);
  const span = max - min || 1;
  const fillPct = ((current - min) / span) * 100;
  const markerPct = marker ? ((marker.value - min) / span) * 100 : null;

  return (
    <div className={cn("relative pt-1", marker ? "pb-5" : "pb-1")}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        // Fill position is runtime data, so it goes through a CSS variable in
        // `style` — the class that reads it stays a single static string.
        style={{ ...style, "--range-fill": `${fillPct}%` } as React.CSSProperties}
        className={cn(
          "h-2 w-full cursor-pointer appearance-none rounded-full",
          "bg-[linear-gradient(to_right,var(--color-brand)_var(--range-fill),var(--color-slate-200)_var(--range-fill))]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          THUMB,
          TRACK,
          className,
        )}
        {...props}
      />
      {marker && markerPct !== null && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-1 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${markerPct}%` }}
        >
          <span className="h-3 w-px bg-slate-400" />
          <span className="mt-1 whitespace-nowrap text-micro text-muted">{marker.label}</span>
        </div>
      )}
    </div>
  );
};
