import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Without these groups tailwind-merge reads `text-display` as a text colour and
// drops the font size from `text-display text-ink`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ["soft", "card", "lift", "brand", "brand-lg"],
    },
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "display-compact",
            "title",
            "stat",
            "lead",
            "card-title",
            "body",
            "field",
            "ui",
            "body-sm",
            "caption",
            "badge",
            "eyebrow",
            "sub",
            "micro",
          ],
        },
      ],
      "bg-image": ["gradient-brand", "gradient-hero", "text-gradient-hero"],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
