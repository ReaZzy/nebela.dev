import { useState, useRef, useId, type KeyboardEvent } from "react";

type TabColor = "red" | "green" | "blue" | "yellow" | "zinc";

interface Tab {
  color: TabColor;
  label: string;
  code: string;
  description?: string;
}

interface ExampleTabsProps {
  tabs: Tab[];
  label?: string;
}

const colorStyles: Record<TabColor, { active: string; border: string }> = {
  red: {
    active: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50",
    border: "border-red-500",
  },
  green: {
    active: "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50",
    border: "border-green-500",
  },
  blue: {
    active: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/50",
    border: "border-blue-500",
  },
  yellow: {
    active: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/50",
    border: "border-yellow-500",
  },
  zinc: {
    active: "bg-zinc-500/20 text-zinc-600 dark:text-zinc-300 border border-zinc-500/50",
    border: "border-zinc-500",
  },
};

export default function ExampleTabs({ tabs, label = "Code examples" }: ExampleTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = (activeIndex - 1 + tabs.length) % tabs.length;
      setActiveIndex(next);
      tabRefs.current[next]?.focus();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (activeIndex + 1) % tabs.length;
      setActiveIndex(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <div className="my-6">
      <div role="tablist" aria-label={label} className="flex gap-1 mb-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            aria-selected={activeIndex === i}
            aria-controls={`${id}-panel-${i}`}
            id={`${id}-tab-${i}`}
            tabIndex={activeIndex === i ? 0 : -1}
            onClick={() => setActiveIndex(i)}
            onKeyDown={handleKeyDown}
            className={`px-3 py-1.5 font-mono text-sm transition-colors duration-200 cursor-pointer select-none active:scale-95 ${
              activeIndex === i
                ? colorStyles[tab.color].active
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={activeIndex !== i}
          className={`px-3 pt-2 border-l-2 bg-zinc-200 dark:bg-zinc-800 overflow-x-auto ${colorStyles[tab.color].border}`}
        >
          <div className="font-mono text-sm text-zinc-800 dark:text-zinc-100 whitespace-pre-wrap mb-2">{tab.code}</div>
          {tab.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mb-2">{tab.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
