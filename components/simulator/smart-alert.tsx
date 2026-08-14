import type { SectionInputMap } from "@/components/simulator/types";
import { Alert } from "@/components/ui/alert";
import { Stack } from "@/components/ui/layout-primitives";
import { scoreSection, type SectionId, type SectionInput, type SectionResult, type TotalResult } from "@/lib/engine";

export type SmartAlertProps = Omit<React.ComponentProps<"div">, "children"> & {
  lab: SectionInputMap;
  result: TotalResult;
  touched: boolean;
};

const SECTION_LABEL: Record<SectionId, string> = { rw: "R&W", math: "Math" };
const ORDER: SectionId[] = ["rw", "math"];

const sectionAlert = (
  section: SectionId,
  input: SectionInput,
  result: SectionResult,
): { section: SectionId; message: string } | null => {
  if (result.distanceToThreshold > 0 && result.distanceToThreshold <= 2) {
    const n = result.distanceToThreshold;
    // n more mistakes are needed to actually reach the flip — not always 1.
    const preview = scoreSection(section, {
      m1Mistakes: input.m1Mistakes + n,
      m2Mistakes: input.m2Mistakes,
    });
    return {
      section,
      message: `Ещё ${n} ${n === 1 ? "ошибка" : "ошибки"} в ${SECTION_LABEL[section]} Module 1 — и полетишь в лёгкий модуль: потолок упадёт до ${preview.scoreHigh}.`,
    };
  }

  if (result.route === "easy") {
    const preview = scoreSection(section, { m1Mistakes: input.m1Mistakes, m2Mistakes: 0 });
    return {
      section,
      message: `${SECTION_LABEL[section]}: лёгкий маршрут. Балл выше ${preview.scoreHigh} недоступен, сколько ни решай второй модуль.`,
    };
  }

  return null;
};

export const SmartAlert = ({ lab, result, touched, ...props }: SmartAlertProps) => {
  const results: Record<SectionId, SectionResult> = { rw: result.rw, math: result.math };
  const alerts = ORDER.map((section) => sectionAlert(section, lab[section], results[section])).filter(
    (alert) => alert !== null,
  );

  if (alerts.length > 0) {
    return (
      <Stack gap={2} {...props}>
        {alerts.map((alert) => (
          <Alert key={alert.section} tone="warn">
            {alert.message}
          </Alert>
        ))}
      </Stack>
    );
  }

  if (!touched) {
    return (
      <Alert tone="info" {...props}>
        Подвигай ползунки — увидишь, как ошибки превращаются в балл.
      </Alert>
    );
  }

  return null;
};
