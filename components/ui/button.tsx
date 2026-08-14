import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

type ButtonBase = React.ComponentProps<"button"> & {
  variant?: NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
  loading?: boolean;
};

export type ButtonProps =
  | (ButtonBase & { size?: Exclude<ButtonSize, "icon"> })
  | (ButtonBase & { size: "icon" } & (
        | { "aria-label": string }
        | { "aria-labelledby": string }
      ));

export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "cursor-pointer select-none whitespace-nowrap border border-transparent",
    "no-underline hover:no-underline",
    // Tailwind v4 lifts via the standalone `translate` property, so a
    // `transform`-only transition would never fire.
    "[transition:transform_.12s_ease,translate_.12s_ease,scale_.12s_ease,box-shadow_.2s_ease,background-color_.2s_ease]",
    "[&>svg]:shrink-0",
    // The :active and motion-reduce resets repeat the not-disabled guards so
    // they match the hover rule's specificity and win on source order.
    "not-disabled:not-aria-disabled:hover:-translate-y-px",
    "not-disabled:not-aria-disabled:active:translate-y-0",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
    "aria-disabled:pointer-events-none aria-disabled:opacity-60 aria-disabled:shadow-none",
    "motion-reduce:transition-none",
    "not-disabled:not-aria-disabled:motion-reduce:hover:translate-y-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "gradient-brand text-white shadow-brand",
          "not-disabled:not-aria-disabled:hover:shadow-brand-lg",
        ],
        secondary: [
          "bg-brand-50 text-brand-deep",
          "not-disabled:not-aria-disabled:hover:bg-brand-100",
        ],
        outline: [
          "border-line bg-white text-slate-700",
          "not-disabled:not-aria-disabled:hover:border-brand",
          "not-disabled:not-aria-disabled:hover:text-brand-deep",
        ],
        ghost: [
          "bg-transparent text-slate-600",
          "not-disabled:not-aria-disabled:hover:bg-slate-100",
        ],
        danger: [
          "bg-err text-white",
          "not-disabled:not-aria-disabled:hover:bg-err-ink",
        ],
      },
      size: {
        sm: "rounded-md px-3.5 py-2 text-caption font-bold leading-none [&>svg]:size-[17px]",
        md: "rounded-lg px-5 py-3 text-ui [&>svg]:size-[17px]",
        lg: "rounded-lg px-[26px] py-[15px] text-body font-bold leading-none [&>svg]:size-[17px]",
        icon: "rounded-md p-[11px] [&>svg]:size-[18px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = ({
  className,
  variant,
  size,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
};
