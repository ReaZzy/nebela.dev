import { useEffect, useState, useCallback } from "react";
import {
  type Theme,
  getThemeFromDOM,
  applyTheme,
  saveTheme,
} from "@/utils/theme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme | null>(null);

  const toggle = useCallback(() => {
    if (!theme) return;
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    applyTheme(newTheme);
    saveTheme(newTheme);
  }, [theme]);

  useEffect(() => {
    setTheme(getThemeFromDOM());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "t" &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        toggle();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle]);

  if (!theme) return null;

  return (
    <button
      onClick={toggle}
      className={`font-mono text-zinc-500 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-400 active:text-green-600 dark:active:text-green-400 transition-colors duration-200 text-base cursor-pointer ${className ?? ""}`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme (press t)`}
    >
      [t] {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
