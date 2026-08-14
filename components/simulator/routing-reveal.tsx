import { useEffect, useRef, useState } from "react";

import { RouteBadge } from "@/components/simulator/route-badge";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout-primitives";
import { ENGINE_CONFIG, type SectionId } from "@/lib/engine";
import { cn } from "@/lib/utils";

export type RoutingRevealProps = { section: SectionId };

type Phase = "idle" | "travel" | "verdict" | "done";

// ~1.2s ease-out per spec; the JS timer and the CSS transition duration are
// driven off this one constant so they can't drift apart.
const TRAVEL_MS = 1200;
// Deliberate beat before the fill starts moving, not a race fix: useEffect
// already runs after paint, so the idle frame (width 0) is committed well
// before this fires.
const IDLE_MS = 20;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const RoutingReveal = ({ section }: RoutingRevealProps) => {
  const { state, simTotal, dispatch } = useSimulator();
  const [phase, setPhase] = useState<Phase>("idle");
  const nextRef = useRef<HTMLButtonElement>(null);

  const cfg = ENGINE_CONFIG[section];
  const input = state.simDraft[section];
  const result = simTotal[section];
  const m1Correct = cfg.m1Questions - input.m1Mistakes;
  const thresholdPct = (cfg.routingThreshold / cfg.m1Questions) * 100;
  const fillPct = (m1Correct / cfg.m1Questions) * 100;

  useEffect(() => {
    if (phase !== "idle") return;
    const id = window.setTimeout(() => setPhase(prefersReducedMotion() ? "done" : "travel"), IDLE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "travel") return;
    const id = window.setTimeout(() => setPhase("verdict"), TRAVEL_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "verdict" || phase === "done") nextRef.current?.focus();
  }, [phase]);

  const revealed = phase === "verdict" || phase === "done";
  // A fresh key on "done" forces a brand-new DOM node with no transition
  // history, so a skip mid-animation (or a reduced-motion mount) snaps to
  // the final width instead of fighting an in-flight CSS transition that
  // toggling classes alone can't reliably interrupt.
  const fillKey = phase === "done" ? "done" : "reveal";

  return (
    <div onClick={revealed ? undefined : () => setPhase("done")}>
      <div className="relative pt-1 pb-5">
        <div className="h-2 rounded-full bg-slate-200">
          <div
            key={fillKey}
            className={cn(
              "h-full rounded-full gradient-brand",
              phase === "travel" && "transition-[width] ease-out",
            )}
            style={{ width: `${phase === "idle" ? 0 : fillPct}%`, transitionDuration: `${TRAVEL_MS}ms` }}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute top-1 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${thresholdPct}%` }}
        >
          <span className="h-3 w-px bg-slate-400" />
          <span className="mt-1 whitespace-nowrap text-micro text-muted">порог сложного модуля</span>
        </div>
      </div>
      {revealed && (
        <Stack gap={4} className="mt-4">
          <RouteBadge
            route={result.route}
            className={cn(
              "self-start",
              phase === "verdict" &&
                "transition-[opacity,translate] duration-300 ease-out starting:opacity-0 starting:-translate-y-1",
            )}
          />
          <Alert tone={result.route === "hard" ? "ok" : "warn"}>
            {result.route === "hard"
              ? "Экзамен решил: ты готов к сложным вопросам. Открыт полный диапазон до 800."
              : `Модуль 1 не добрал до порога. Второй модуль будет легче, но потолок — около ${ENGINE_CONFIG.easyRouteCap[section]}.`}
          </Alert>
          <Button
            ref={nextRef}
            variant="primary"
            size="lg"
            className="self-start"
            onClick={() => dispatch({ type: "ADVANCE_SIM" })}
          >
            Дальше
          </Button>
        </Stack>
      )}
    </div>
  );
};
