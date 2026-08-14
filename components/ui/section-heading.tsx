import { cn } from "@/lib/utils";

export type SectionHeadingProps = Omit<React.ComponentProps<"div">, "title"> & {
  num?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
};

export const SectionHeading = ({
  className,
  num,
  title,
  description,
  level = 2,
  ...props
}: SectionHeadingProps) => {
  const Heading = `h${level}` as const;
  return (
    <div className={cn("mb-5.5", className)} {...props}>
      <div className="flex items-baseline gap-3">
        {num ? (
          <span className="text-caption font-extrabold text-brand tabular-nums">{num}</span>
        ) : null}
        <Heading className="text-title text-ink">{title}</Heading>
      </div>
      {description ? (
        <p className="mt-1.5 max-w-[720px] text-body-sm text-muted">{description}</p>
      ) : null}
    </div>
  );
};
