import { cn } from "@/lib/utils";

export type RowProps = React.ComponentProps<"div">;

export type ColsProps = React.ComponentProps<"div">;

export type StackProps = React.ComponentProps<"div"> & { gap?: keyof typeof gapClass };

export const Row = ({ className, ...props }: RowProps) => {
  return <div className={cn("flex flex-wrap items-center gap-3.5", className)} {...props} />;
};

export const Cols = ({ className, ...props }: ColsProps) => {
  return (
    <div
      className={cn(
        "grid items-start gap-6 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]",
        className,
      )}
      {...props}
    />
  );
};

const gapClass = {
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  6: "gap-6",
} as const;

export const Stack = ({ className, gap = 3, ...props }: StackProps) => {
  return <div className={cn("flex flex-col", gapClass[gap], className)} {...props} />;
};
