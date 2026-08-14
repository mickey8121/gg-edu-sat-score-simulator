import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Стратег балла — SAT Portal",
    template: "%s — SAT Portal",
  },
  description:
    "Симулятор балла Digital SAT: пойми, как ответы превращаются в балл, и сколько ошибок можно себе позволить.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="ru" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
};

export default RootLayout;
