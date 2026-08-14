import { Play, SlidersHorizontal, Target } from "lucide-react";
import { useRef } from "react";

import type { TabId } from "@/components/simulator/types";
import { SegmentedTabs, type SegmentedTabsItem } from "@/components/ui/segmented-tabs";

export type StepTabsProps = React.ComponentProps<"div"> & {
  tab: TabId;
  onTabChange: (tab: TabId) => void;
};

interface TabEntry {
  value: TabId;
  label: string;
  icon: React.ElementType;
}

const TAB_ENTRIES: TabEntry[] = [
  { value: "sim", label: "Симуляция", icon: Play },
  { value: "lab", label: "Песочница", icon: SlidersHorizontal },
  { value: "plan", label: "Мой план", icon: Target },
];

export const StepTabs = ({ tab, onTabChange, ...divProps }: StepTabsProps) => {
  const buttonRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    sim: null,
    lab: null,
    plan: null,
  });

  const activate = (index: number) => {
    const value = TAB_ENTRIES[index].value;
    buttonRefs.current[value]?.focus();
    onTabChange(value);
  };

  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activate((index + 1) % TAB_ENTRIES.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      activate((index - 1 + TAB_ENTRIES.length) % TAB_ENTRIES.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      activate(0);
    } else if (event.key === "End") {
      event.preventDefault();
      activate(TAB_ENTRIES.length - 1);
    }
  };

  const items: SegmentedTabsItem[] = TAB_ENTRIES.map((entry, index) => ({
    value: entry.value,
    label: entry.label,
    icon: <entry.icon aria-hidden />,
    id: `tab-${entry.value}`,
    controls: `panel-${entry.value}`,
    selected: tab === entry.value,
    tabIndex: tab === entry.value ? 0 : -1,
    onClick: () => onTabChange(entry.value),
    onKeyDown: handleKeyDown(index),
    ref: (node: HTMLButtonElement | null) => {
      buttonRefs.current[entry.value] = node;
    },
  }));

  return <SegmentedTabs aria-label="Разделы симулятора" items={items} {...divProps} />;
};
