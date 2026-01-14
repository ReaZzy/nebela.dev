import { useState, useRef, type KeyboardEvent } from "react";

interface Example {
  code: string;
  description?: string;
}

interface GoodBadTabsProps {
  bad: Example;
  good: Example;
}

export default function GoodBadTabs({ bad, good }: GoodBadTabsProps) {
  const [activeTab, setActiveTab] = useState<"bad" | "good">("bad");
  const tabRefs = useRef<{ bad: HTMLButtonElement | null; good: HTMLButtonElement | null }>({
    bad: null,
    good: null,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextTab = activeTab === "bad" ? "good" : "bad";
      setActiveTab(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  const tabClass = (tab: "bad" | "good") =>
    `px-3 py-1.5 font-mono text-sm transition-colors duration-200 cursor-pointer select-none active:scale-95 ${
      activeTab === tab
        ? tab === "bad"
          ? "bg-red-500/20 text-red-400 border border-red-500/50"
          : "bg-green-500/20 text-green-400 border border-green-500/50"
        : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-300"
    }`;

  const panelClass = (tab: "bad" | "good") =>
    `px-3 pt-2 border-l-2 bg-zinc-800 overflow-x-auto ${
      tab === "bad" ? "border-red-500" : "border-green-500"
    }`;

  return (
    <div className="my-6">
      <div role="tablist" aria-label="Code example comparison" className="flex gap-1 mb-2">
        <button
          ref={(el) => { tabRefs.current.bad = el; }}
          role="tab"
          aria-selected={activeTab === "bad"}
          aria-controls="tabpanel-bad"
          id="tab-bad"
          tabIndex={activeTab === "bad" ? 0 : -1}
          onClick={() => setActiveTab("bad")}
          onKeyDown={handleKeyDown}
          className={tabClass("bad")}
        >
          Bad
        </button>
        <button
          ref={(el) => { tabRefs.current.good = el; }}
          role="tab"
          aria-selected={activeTab === "good"}
          aria-controls="tabpanel-good"
          id="tab-good"
          tabIndex={activeTab === "good" ? 0 : -1}
          onClick={() => setActiveTab("good")}
          onKeyDown={handleKeyDown}
          className={tabClass("good")}
        >
          Good
        </button>
      </div>

      <div
        role="tabpanel"
        id="tabpanel-bad"
        aria-labelledby="tab-bad"
        hidden={activeTab !== "bad"}
        className={panelClass("bad")}
      >
        <div className="font-mono text-sm text-zinc-100 whitespace-pre-wrap mb-2">{bad.code}</div>
        {bad.description && <p className="text-sm text-zinc-400 font-sans mb-2">{bad.description}</p>}
      </div>

      <div
        role="tabpanel"
        id="tabpanel-good"
        aria-labelledby="tab-good"
        hidden={activeTab !== "good"}
        className={panelClass("good")}
      >
        <div className="font-mono text-sm text-zinc-100 whitespace-pre-wrap mb-2">{good.code}</div>
        {good.description && <p className="text-sm text-zinc-400 font-sans mb-2">{good.description}</p>}
      </div>
    </div>
  );
}
