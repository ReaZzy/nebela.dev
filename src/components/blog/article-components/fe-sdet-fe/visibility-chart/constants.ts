import type { LineConfig } from "./types";

export const CHART = {
  width: 500,
  height: 320,
  padding: { left: 30, right: 30, top: 20, bottom: 20 },
} as const;

export const AXIS = {
  color: "#a1a1aa",
  strokeWidth: 2,
  arrowSize: 5,
  labels: { x: "Effort", y: "Visibility of work" },
} as const;

export const TOOLTIP = {
  padding: 10,
  charWidth: 8.5,
  lineHeight: 20,
  maxCharsPerLine: 22,
  arrowSize: 8,
  offset: 20,
  bg: "#27272a",
  border: "#3f3f46",
  text: "#f4f4f5",
} as const;

export const DOT = {
  radius: { default: 10, active: 14 },
} as const;

export const LINES: LineConfig[] = [
  {
    name: "Frontend",
    color: "#f4f4f5",
    points: [
      { x: 30, y: 100 },
      { x: 60, y: 55 },
      { x: 120, y: 42 },
      { x: 300, y: 26 },
      { x: 470, y: 22 },
    ],
    dots: [
      { x: 50, label: "Adding a new simple page" },
      { x: 380, label: "Roll out a design-system change" },
    ],
  },
  {
    name: "SDET",
    color: "#4ade80",
    points: [
      { x: 30, y: 295 },
      { x: 100, y: 295 },
      { x: 170, y: 294 },
      { x: 240, y: 290 },
      { x: 360, y: 255 },
      { x: 470, y: 125 },
    ],
    dots: [
      { x: 208, label: "Make tests actually reliable" },
      { x: 288, label: "Catching regressions before release and QA" },
      { x: 388, label: "Make tests part of everyday dev workflow" },
    ],
  },
];
