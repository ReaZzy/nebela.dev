import { useState, useEffect } from "react";

export const THEME_STORAGE_KEY = "theme";
export type Theme = "light" | "dark";
export const DEFAULT_THEME: Theme = "dark";

export function getThemeFromDOM(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function getStoredTheme(): Theme | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
}

export function applyTheme(theme: Theme): void {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function useIsDarkMode(): boolean {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkDark = () => setIsDark(getThemeFromDOM() === "dark");
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}
