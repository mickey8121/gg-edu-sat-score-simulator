import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input">;

export type SelectProps = React.ComponentProps<"select">;

export type TextareaProps = React.ComponentProps<"textarea">;

export const fieldVariants = cva(
  [
    "w-full rounded-md px-3.5 py-[11px]",
    "text-field text-ink",
    "border border-line bg-white",
    "transition-[border-color,box-shadow] duration-200",
    "focus-visible:border-brand focus-visible:ring focus-visible:outline-none",
    "aria-[invalid=true]:border-err aria-[invalid=true]:focus-visible:ring-err/15",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
    "read-only:bg-slate-50",
  ],
  {
    variants: {
      control: {
        input: "",
        select: "",
        textarea: "resize-y",
      },
    },
    defaultVariants: { control: "input" },
  },
);

export const Input = ({ className, ...props }: InputProps) => {
  return <input className={cn(fieldVariants({ control: "input" }), className)} {...props} />;
};

export const Select = ({ className, ...props }: SelectProps) => {
  return <select className={cn(fieldVariants({ control: "select" }), className)} {...props} />;
};

export const Textarea = ({ className, ...props }: TextareaProps) => {
  return (
    <textarea className={cn(fieldVariants({ control: "textarea" }), className)} {...props} />
  );
};
