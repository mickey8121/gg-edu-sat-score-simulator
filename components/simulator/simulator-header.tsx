import { Hero } from "@/components/layout/hero";
import { Eyebrow } from "@/components/ui/eyebrow";

export type SimulatorHeaderProps = React.ComponentProps<"header">;

export const SimulatorHeader = ({ className, ...props }: SimulatorHeaderProps) => {
  return (
    <Hero className={className} {...props}>
      <Eyebrow>SAT PORTAL · ИНСТРУМЕНТ</Eyebrow>
      <h1 className="mt-5 mb-3 text-display text-ink">Стратег балла</h1>
      <p className="max-w-[680px] text-lead">
        Пойми, как Digital SAT превращает твои ответы в балл — и сколько ошибок можно позволить на
        пути к цели.
      </p>
    </Hero>
  );
};
