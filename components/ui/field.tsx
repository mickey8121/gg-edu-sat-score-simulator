import { cn } from "@/lib/utils";

export type FieldProps = Omit<React.ComponentProps<"div">, "id"> & {
  htmlFor: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
};

export const fieldIds = (id: string) => ({ hintId: `${id}-hint`, errorId: `${id}-error` });

export const describedBy = (id: string, has: { hint?: boolean; error?: boolean }) => {
  const { hintId, errorId } = fieldIds(id);
  const ids = [has.hint ? hintId : null, has.error ? errorId : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
};

export const Field = ({
  className,
  htmlFor,
  label,
  hint,
  error,
  required = false,
  children,
  ...props
}: FieldProps) => {
  const { hintId, errorId } = fieldIds(htmlFor);
  return (
    <div className={cn("mb-4.5", className)} {...props}>
      <label htmlFor={htmlFor} className="mb-[7px] block text-caption font-bold text-slate-600">
        {label}
        {required ? (
          <span className="text-err" aria-hidden>
            {" *"}
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="mt-1.5 text-caption text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 text-caption text-err-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
};
