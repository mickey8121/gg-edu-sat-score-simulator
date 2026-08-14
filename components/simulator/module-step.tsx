import { PresetPills } from "@/components/simulator/preset-pills";
import { RouteBadge } from "@/components/simulator/route-badge";
import { useSimulator } from "@/components/simulator/simulator-provider";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/layout-primitives";
import { RangeSlider } from "@/components/ui/range-slider";
import { ENGINE_CONFIG, type Route, type SectionId } from "@/lib/engine";

export type ModuleStepProps = { section: SectionId; module: "m1" | "m2" };

type CorrectPickerProps = {
  id: string;
  questions: number;
  correct: number;
  presets: { value: number; label: string }[];
  onChange: (value: number) => void;
};

type ScoreScaleProps = { score: number; ceiling: number };

const SCORE_MIN = 200;
const SCORE_MAX = 800;

const MODULE_INFO: Record<SectionId, { label: string; duration: string; presets: { value: number; label: string }[] }> = {
  rw: {
    label: "R&W",
    duration: "32 минуты",
    presets: [
      { value: 25, label: "Почти всё" },
      { value: 20, label: "Норм" },
      { value: 15, label: "Тяжело зашло" },
    ],
  },
  // Math module timing isn't in the spec — this is the real Digital SAT's
  // actual format (22 questions / 35 minutes per module), independent of
  // the scoring curve and not part of the calibration pass on ENGINE_CONFIG.
  math: {
    label: "Math",
    duration: "35 минут",
    presets: [
      { value: 20, label: "Почти всё" },
      { value: 16, label: "Норм" },
      { value: 12, label: "Тяжело зашло" },
    ],
  },
};

const questionWord = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "вопрос";
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return "вопроса";
  return "вопросов";
};

const ceilingCaption = (route: Route, cap: number): string =>
  route === "hard" ? "Открыт полный диапазон — до 800" : `Потолок на этом маршруте — около ${cap}`;

const CorrectPicker = ({ id, questions, correct, presets, onChange }: CorrectPickerProps) => {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="text-caption font-bold text-slate-600">
          Правильных ответов
        </label>
        <span className="text-caption text-muted">
          {correct} из {questions}
        </span>
      </div>
      <RangeSlider
        id={id}
        min={0}
        max={questions}
        value={correct}
        aria-valuetext={`${correct} правильных из ${questions}`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <PresetPills className="mt-4" items={presets} active={correct} onSelect={onChange} />
    </div>
  );
};

// Purely decorative — track width itself (not just the fill) is capped on
// the easy route, so "truncated" is a literal, checkable visual rather than
// just caption text. The accessible narrative lives in RouteBadge + the
// caption next to it, not here.
const ScoreScale = ({ score, ceiling }: ScoreScaleProps) => {
  const span = SCORE_MAX - SCORE_MIN;
  const trackPct = ((ceiling - SCORE_MIN) / span) * 100;
  const fillPct = ((score - SCORE_MIN) / (ceiling - SCORE_MIN)) * 100;

  return (
    <div aria-hidden className="mt-3 h-1.5 rounded-full bg-slate-100" style={{ width: `${trackPct}%` }}>
      <div className="h-full rounded-full gradient-brand" style={{ width: `${fillPct}%` }} />
    </div>
  );
};

export const ModuleStep = ({ section, module }: ModuleStepProps) => {
  const { state, simTotal, dispatch } = useSimulator();
  const cfg = ENGINE_CONFIG[section];
  const info = MODULE_INFO[section];
  const questions = module === "m1" ? cfg.m1Questions : cfg.m2Questions;
  const mistakesKey = module === "m1" ? "m1Mistakes" : "m2Mistakes";
  const correct = questions - state.simDraft[section][mistakesKey];
  const result = simTotal[section];

  const setCorrect = (value: number) =>
    dispatch({ type: "SET_SIM_MISTAKES", section, module, value: questions - value });

  return (
    <Stack gap={6}>
      <div>
        <p className="text-caption font-bold text-slate-600">
          {info.label} · Module {module === "m1" ? 1 : 2}
        </p>
        <p className="mt-1 text-body text-ink">
          {questions} {questionWord(questions)} · {info.duration}
        </p>
      </div>
      {module === "m2" && (
        <div>
          <div className="flex items-center gap-3">
            <RouteBadge route={result.route} />
            <span className="text-caption text-muted">
              {ceilingCaption(result.route, ENGINE_CONFIG.easyRouteCap[section])}
            </span>
          </div>
          <ScoreScale score={result.score} ceiling={result.scoreHigh} />
        </div>
      )}
      <CorrectPicker
        id={`${section}-${module}-correct`}
        questions={questions}
        correct={correct}
        presets={info.presets}
        onChange={setCorrect}
      />
      {correct === 0 && <Alert tone="info">Бывает. Смотри, что это значит для маршрута.</Alert>}
      <Button
        variant="primary"
        size="lg"
        className="self-start"
        onClick={() => dispatch({ type: "ADVANCE_SIM" })}
      >
        Дальше
      </Button>
    </Stack>
  );
};
