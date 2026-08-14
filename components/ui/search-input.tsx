import { Search } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SearchInputProps = Omit<InputProps, "type"> & {
  type?: "search" | "text";
  inputClassName?: string;
};

export const SearchInput = ({
  className,
  inputClassName,
  type = "search",
  ...props
}: SearchInputProps) => {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[13px] size-[18px] -translate-y-1/2 text-slate-400"
      />
      <Input type={type} className={cn("pl-[42px]", inputClassName)} {...props} />
    </div>
  );
};
