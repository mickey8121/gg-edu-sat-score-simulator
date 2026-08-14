import { cn } from "@/lib/utils";

export type PageContainerProps = React.ComponentProps<"div">;

export const PageContainer = ({ className, ...props }: PageContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-page px-5 pt-9 pb-18 sm:px-8 sm:pt-14 sm:pb-24",
        className,
      )}
      {...props}
    />
  );
};
