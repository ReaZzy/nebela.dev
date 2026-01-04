import { useState, useEffect, type ReactNode } from "react";
import { BREAKPOINTS, type Breakpoint } from "@/constants/breakpoints";

interface MediaQueryProps {
  minWidth?: number | Breakpoint;
  maxWidth?: number | Breakpoint;
  children: ReactNode;
}

export default function MediaQuery({ minWidth, maxWidth, children }: MediaQueryProps) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const resolveBreakpoint = (value: number | Breakpoint): number => {
      return typeof value === "number" ? value : BREAKPOINTS[value];
    };

    const queries: string[] = [];
    if (minWidth) queries.push(`(min-width: ${resolveBreakpoint(minWidth)}px)`);
    if (maxWidth) queries.push(`(max-width: ${resolveBreakpoint(maxWidth)}px)`);

    const mediaQuery = window.matchMedia(queries.join(" and "));

    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [minWidth, maxWidth]);

  return matches ? <>{children}</> : null;
}
