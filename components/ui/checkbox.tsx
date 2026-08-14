import { cn } from "@/lib/utils";

export type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  label: React.ReactNode;
  inputClassName?: string;
};

export const Checkbox = ({ className, inputClassName, label, ...props }: CheckboxProps) => {
  return (
    <label
      className={cn(
        "flex items-center gap-2.5 py-1.5 text-ui font-normal leading-[1.6] text-copy",
        props.disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        type="checkbox"
        className={cn(
          "size-[18px] shrink-0 cursor-pointer accent-brand",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          "disabled:cursor-not-allowed",
          inputClassName,
        )}
        {...props}
      />
      {label}
    </label>
  );
};
