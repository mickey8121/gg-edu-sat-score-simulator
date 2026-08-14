import { cn } from "@/lib/utils";

export type StickyNavItem = { href: string; label: string; active?: boolean };

export type StickyNavProps = React.ComponentProps<"nav"> & {
  items: StickyNavItem[];
  "aria-label": string;
};

export const StickyNav = ({ className, items, ...props }: StickyNavProps) => {
  return (
    <nav
      className={cn(
        "sticky top-3.5 z-40 my-6 flex flex-wrap gap-1.5 rounded-lg border border-line",
        "bg-card/82 p-2.5 shadow-soft backdrop-blur-[10px]",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "rounded-sm px-[13px] py-[7px] text-caption font-bold no-underline hover:no-underline",
            "text-slate-600 hover:bg-brand-50 hover:text-brand-deep",
            "aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-deep",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};
