import { cn } from "@/lib/utils";

export type SimProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  currentStep: number; // 1..7
};

const TOTAL_STEPS = 7;

export const SimProgress = ({ className, currentStep, ...props }: SimProgressProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <span className="sr-only">
        Шаг {currentStep} из {TOTAL_STEPS}
      </span>
      <div aria-hidden className="flex flex-1 items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            className={cn("h-1.5 flex-1 rounded-full", index < currentStep ? "bg-brand" : "bg-slate-200")}
          />
        ))}
      </div>
    </div>
  );
};
