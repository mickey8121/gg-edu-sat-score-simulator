import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export type CardProps = React.ComponentProps<"div"> & { interactive?: boolean };

export type CardIconTileProps = React.ComponentProps<"div">;

export type CardTitleProps = React.ComponentProps<"h3"> & { level?: 2 | 3 | 4 };

export type CardTextProps = React.ComponentProps<"p">;

export type CardFooterProps = React.ComponentProps<"div">;

export const cardVariants = cva(
  [
    "rounded-lg border border-line bg-card p-[22px] shadow-card",
    "transition-[transform,translate,scale,box-shadow] duration-[180ms]",
    "hover:-translate-y-[3px] hover:shadow-lift",
    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  ],
  {
    variants: {
      interactive: {
        true: [
          "relative",
          "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2",
          "has-[a:focus-visible]:outline-brand",
        ],
        false: "",
      },
    },
    defaultVariants: { interactive: false },
  },
);

export const Card = ({ className, interactive = false, ...props }: CardProps) => {
  return <div className={cn(cardVariants({ interactive }), className)} {...props} />;
};

export const CardIconTile = ({ className, ...props }: CardIconTileProps) => {
  return (
    <div
      className={cn(
        "mb-[14px] flex size-11 items-center justify-center rounded-md bg-brand-50 text-brand-deep",
        "[&>svg]:size-[22px]",
        className,
      )}
      {...props}
    />
  );
};

export const CardTitle = ({ className, level = 3, ...props }: CardTitleProps) => {
  const Heading = `h${level}` as const;
  return <Heading className={cn("mb-1.5 text-card-title text-ink", className)} {...props} />;
};

export const CardText = ({ className, ...props }: CardTextProps) => {
  return <p className={cn("mb-4 text-body-sm text-muted", className)} {...props} />;
};

export const CardFooter = ({ className, ...props }: CardFooterProps) => {
  return <div className={cn("flex items-center justify-between", className)} {...props} />;
};
