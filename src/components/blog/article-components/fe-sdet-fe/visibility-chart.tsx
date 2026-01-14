import { useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface DotConfig {
  x: number;
  label?: string;
}

interface ChartPointProps {
  point: Point;
  id: string;
  fill: string;
  isActive: boolean;
  shouldBlink: boolean;
  onEnter: (id: string) => void;
  onLeave: (id: string) => void;
}

function sampleBezier(
  p0: { x: number; y: number },
  cp1: { x: number; y: number },
  cp2: { x: number; y: number },
  p1: { x: number; y: number },
  samples: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const t2 = t * t;
    const t3 = t2 * t;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;

    points.push({
      x: mt3 * p0.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p1.x,
      y: mt3 * p0.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p1.y,
    });
  }
  return points;
}

function sampleCurve(linePoints: { x: number; y: number }[]): { x: number; y: number }[] {
  if (linePoints.length < 2) return linePoints;

  const allPoints: { x: number; y: number }[] = [linePoints[0]];

  for (let i = 0; i < linePoints.length - 1; i++) {
    const p0 = linePoints[i - 1] || linePoints[i];
    const p1 = linePoints[i];
    const p2 = linePoints[i + 1];
    const p3 = linePoints[i + 2] || p2;

    const cp1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const cp2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };

    const segmentPoints = sampleBezier(p1, cp1, cp2, p2, 20);
    allPoints.push(...segmentPoints.slice(1));
  }

  return allPoints;
}

function getYFromCurve(sampledPoints: { x: number; y: number }[], x: number): number {
  for (let i = 0; i < sampledPoints.length - 1; i++) {
    const p1 = sampledPoints[i];
    const p2 = sampledPoints[i + 1];
    if (x >= p1.x && x <= p2.x) {
      const t = (x - p1.x) / (p2.x - p1.x);
      return p1.y + t * (p2.y - p1.y);
    }
  }
  if (x < sampledPoints[0].x) return sampledPoints[0].y;
  return sampledPoints[sampledPoints.length - 1].y;
}

const FRONTEND_DOT_CONFIGS: DotConfig[] = [
  { x: 50, label: "Adding a new simple page" },
  { x: 380, label: "Roll out a design-system change" },
];

const SDET_DOT_CONFIGS: DotConfig[] = [
  { x: 208, label: "Make tests actually reliable" },
  { x: 288, label: "Catching regressions before release and QA" },
  { x: 388, label: "Make tests part of everyday dev workflow" },
];

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";

  const path = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }

  return path.join(" ");
}

const FRONTEND_LINE_POINTS = [
  { x: 30, y: 100 },
  { x: 60, y: 55 },
  { x: 120, y: 42 },
  { x: 300, y: 26 },
  { x: 470, y: 22 },
];

const SDET_LINE_POINTS = [
  { x: 30, y: 295 },
  { x: 100, y: 295 },
  { x: 170, y: 294 },
  { x: 240, y: 290 },
  { x: 360, y: 255 },
  { x: 470, y: 125 },
];

const FRONTEND_PATH = smoothPath(FRONTEND_LINE_POINTS);
const SDET_PATH = smoothPath(SDET_LINE_POINTS);

const FRONTEND_SAMPLED = sampleCurve(FRONTEND_LINE_POINTS);
const SDET_SAMPLED = sampleCurve(SDET_LINE_POINTS);

const FRONTEND_POINTS: Point[] = FRONTEND_DOT_CONFIGS.map((config) => ({
  x: config.x,
  y: getYFromCurve(FRONTEND_SAMPLED, config.x),
  label: config.label,
}));

const SDET_POINTS: Point[] = SDET_DOT_CONFIGS.map((config) => ({
  x: config.x,
  y: getYFromCurve(SDET_SAMPLED, config.x),
  label: config.label,
}));

function ChartPoint({ point, id, fill, isActive, shouldBlink, onEnter, onLeave }: ChartPointProps) {
  const radius = isActive ? 14 : 10;

  return (
    <g>
      <circle
        onMouseEnter={() => onEnter(id)}
        onMouseLeave={() => onLeave(id)}
        onTouchStart={() => onEnter(id)}
        onTouchEnd={() => onLeave(id)}
        cx={point.x}
        cy={point.y}
        r={radius}
        fill={fill}
        className="cursor-pointer transition-all duration-150"
        style={
          shouldBlink
            ? {
                animation: "blink 1.5s ease-in-out infinite",
                transformOrigin: `${point.x}px ${point.y}px`,
              }
            : undefined
        }
      />
    </g>
  );
}

interface TooltipProps {
  point: Point;
  position: "above" | "below";
}

function ChartTooltip({ point, position }: TooltipProps) {
  if (!point.label) return null;

  const padding = 10;
  const charWidth = 8.5;
  const lineHeight = 20;
  const maxCharsPerLine = 22;
  const arrowSize = 8;

  const words = point.label.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + " " + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  const maxLineLength = Math.max(...lines.map((l) => l.length));
  const boxWidth = maxLineLength * charWidth + padding * 2;
  const boxHeight = lines.length * lineHeight + padding * 2;

  const tooltipY =
    position === "above" ? point.y - boxHeight - arrowSize - 20 : point.y + arrowSize + 20;
  const tooltipX = Math.max(10, Math.min(point.x - boxWidth / 2, 490 - boxWidth));

  const arrowX = point.x;
  const arrowY = position === "above" ? tooltipY + boxHeight : tooltipY;

  const arrowPoints =
    position === "above"
      ? `${arrowX},${arrowY + arrowSize} ${arrowX - arrowSize},${arrowY} ${arrowX + arrowSize},${arrowY}`
      : `${arrowX},${arrowY - arrowSize} ${arrowX - arrowSize},${arrowY} ${arrowX + arrowSize},${arrowY}`;

  return (
    <g className="animate-in fade-in-0 zoom-in-95 duration-150">
      <rect
        x={tooltipX}
        y={tooltipY}
        width={boxWidth}
        height={boxHeight}
        fill="#27272a"
        stroke="#3f3f46"
        strokeWidth="1"
        rx="4"
      />
      <polygon points={arrowPoints} fill="#27272a" stroke="#3f3f46" strokeWidth="1" />
      <rect
        x={tooltipX}
        y={position === "above" ? tooltipY + boxHeight - 4 : tooltipY}
        width={boxWidth}
        height="6"
        fill="#27272a"
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={tooltipX + padding}
          y={tooltipY + padding + lineHeight * (i + 0.75)}
          fontSize="14"
          fill="#f4f4f5"
          fontFamily="Geist Mono, monospace"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export default function VisibilityChart() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>("s-0");
  const [interactedPoints, setInteractedPoints] = useState<Set<string>>(new Set(["s-0"]));

  const handleEnter = useCallback((id: string) => {
    setActiveTooltip(id);
    setInteractedPoints((prev) => new Set([...prev, id]));
  }, []);

  const handleLeave = useCallback(() => {
    setActiveTooltip(null);
  }, []);

  const getActivePoint = (): { point: Point; position: "above" | "below" } | null => {
    if (!activeTooltip) return null;

    const [type, indexStr] = activeTooltip.split("-");
    const index = parseInt(indexStr, 10);

    if (type === "f" && FRONTEND_POINTS[index]) {
      return { point: FRONTEND_POINTS[index], position: "below" };
    }
    if (type === "s" && SDET_POINTS[index]) {
      return { point: SDET_POINTS[index], position: "above" };
    }
    return null;
  };

  const activePointData = getActivePoint();

  return (
    <div className="my-8 flex flex-col items-center">
      <p className="text-center text-zinc-400 italic text-sm mb-4">
        completely made up and subjective chart
      </p>

      <div className="w-full max-w-[500px]">
        <svg viewBox="0 0 500 320" className="w-full h-auto overflow-visible">
          <line x1="30" y1="20" x2="30" y2="300" stroke="#a1a1aa" strokeWidth="2" />
          <polygon points="30,15 25,25 35,25" fill="#a1a1aa" />

          <line x1="30" y1="300" x2="470" y2="300" stroke="#a1a1aa" strokeWidth="2" />
          <polygon points="475,300 465,295 465,305" fill="#a1a1aa" />

          <text
            x="10"
            y="170"
            fontSize="12"
            fill="#a1a1aa"
            transform="rotate(-90, 10, 160)"
            textAnchor="middle"
            fontFamily="Geist Mono, monospace"
          >
            Visibility of work
          </text>
          <text
            x="250"
            y="318"
            fontSize="12"
            fill="#a1a1aa"
            fontFamily="Geist Mono, monospace"
            textAnchor="middle"
          >
            Effort
          </text>

          <path d={FRONTEND_PATH} fill="none" stroke="#f4f4f5" strokeWidth="3" />
          <text
            x="50"
            y="25"
            fontSize="13"
            fill="#f4f4f5"
            fontWeight="500"
            fontFamily="Geist Mono, monospace"
          >
            Frontend
          </text>

          <path d={SDET_PATH} fill="none" stroke="#4ade80" strokeWidth="3" />
          <text
            x="40"
            y="285"
            fontSize="13"
            fill="#4ade80"
            fontWeight="500"
            fontFamily="Geist Mono, monospace"
          >
            SDET
          </text>

          {FRONTEND_POINTS.map((point, i) => {
            const id = `f-${i}`;
            const hasInteracted = interactedPoints.has(id);
            return (
              <ChartPoint
                key={id}
                point={point}
                id={id}
                fill="#a1a1aa"
                isActive={activeTooltip === id}
                shouldBlink={!hasInteracted}
                onEnter={handleEnter}
                onLeave={handleLeave}
              />
            );
          })}

          {SDET_POINTS.map((point, i) => {
            const id = `s-${i}`;
            const hasInteracted = interactedPoints.has(id);
            return (
              <ChartPoint
                key={id}
                point={point}
                id={id}
                fill="#4ade80"
                isActive={activeTooltip === id}
                shouldBlink={!hasInteracted}
                onEnter={handleEnter}
                onLeave={handleLeave}
              />
            );
          })}

          {activePointData && (
            <ChartTooltip point={activePointData.point} position={activePointData.position} />
          )}
        </svg>
      </div>
    </div>
  );
}
