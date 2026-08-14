import { CheckSquare } from "lucide-react";

import { cn } from "@/lib/utils";

export type EmptyStateProps = Omit<React.ComponentProps<"div">, "children"> & {
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export const EmptyState = ({ className, icon, children, action, ...props }: EmptyStateProps) => {
  return (
    <div className={cn("p-[34px] text-center", className)} {...props}>
      <div className="mb-2.5 flex justify-center text-slate-400 [&>svg]:size-10">
        {icon ?? <CheckSquare strokeWidth={1.5} aria-hidden />}
      </div>
      <p className="text-body-sm text-muted">{children}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
};
