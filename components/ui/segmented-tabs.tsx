import { cn } from "@/lib/utils";

export interface SegmentedTabsItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  id?: string;
  controls?: string;
  selected: boolean;
  tabIndex: 0 | -1;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  ref?: React.Ref<HTMLButtonElement>;
}

export type SegmentedTabsProps = React.ComponentProps<"div"> & {
  items: SegmentedTabsItem[];
  "aria-label": string;
};

export const SegmentedTabs = ({
  className,
  items,
  "aria-label": ariaLabel,
  ...props
}: SegmentedTabsProps) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line bg-slate-50 p-1.5",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          role="tab"
          id={item.id}
          aria-selected={item.selected}
          aria-controls={item.controls}
          tabIndex={item.tabIndex}
          ref={item.ref}
          onClick={item.onClick}
          onKeyDown={item.onKeyDown}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-ui",
            "transition-colors duration-200",
            item.selected
              ? "bg-white text-brand-deep shadow-soft"
              : "text-slate-500 hover:text-slate-700",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
};
