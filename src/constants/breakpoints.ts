export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
  "3xl": "2200px",
} as const;

export const mediaQuery = (breakpoint: keyof typeof BREAKPOINTS) =>
  `(min-width: ${BREAKPOINTS[breakpoint]})`;
