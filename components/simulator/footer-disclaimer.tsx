import { SiteFooter } from "@/components/layout/site-footer";

export type FooterDisclaimerProps = React.ComponentProps<"footer">;

export const FooterDisclaimer = ({ className, ...props }: FooterDisclaimerProps) => {
  return (
    <SiteFooter className={className} {...props}>
      Оценка на основе официальных practice-тестов College Board. Реальный балл зависит от версии
      экзамена.
    </SiteFooter>
  );
};
