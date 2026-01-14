import { useState, useCallback, useId } from "react";
import type { DataPoint, ProcessedLine } from "./types";
import { CHART, AXIS, LINES } from "./constants";
import { sampleCurve, createSmoothPath, getYAtX } from "./bezier";
import { ChartDot } from "./chart-dot";
import { ChartTooltip } from "./chart-tooltip";
import { ChartAxes } from "./chart-axes";

const processedLines: ProcessedLine[] = LINES.map((line) => {
  const sampled = sampleCurve(line.points);
  const path = createSmoothPath(line.points);
  const dataPoints: DataPoint[] = line.dots.map((dot) => ({
    x: dot.x,
    y: getYAtX(sampled, dot.x),
    label: dot.label,
  }));

  return { ...line, path, dataPoints };
});

export default function VisibilityChart() {
  const id = useId();
  const [activeId, setActiveId] = useState<string | null>(`${id}-1-0`);
  const [interacted, setInteracted] = useState<Set<string>>(() => new Set([`${id}-1-0`]));

  const handleEnter = useCallback((dotId: string) => {
    setActiveId(dotId);
    setInteracted((prev) => new Set([...prev, dotId]));
  }, []);

  const handleLeave = useCallback(() => {
    setActiveId(null);
  }, []);

  const getActivePoint = (): { point: DataPoint; position: "above" | "below" } | null => {
    if (!activeId) return null;

    for (let lineIdx = 0; lineIdx < processedLines.length; lineIdx++) {
      const line = processedLines[lineIdx];
      for (let dotIdx = 0; dotIdx < line.dataPoints.length; dotIdx++) {
        if (activeId === `${id}-${lineIdx}-${dotIdx}`) {
          return {
            point: line.dataPoints[dotIdx],
            position: lineIdx === 0 ? "below" : "above",
          };
        }
      }
    }

    return null;
  };

  const activePoint = getActivePoint();

  return (
    <figure className="my-8 flex flex-col items-center">
      <figcaption className="text-center text-zinc-400 italic text-sm mb-4">
        completely made up and subjective chart
      </figcaption>

      <div className="w-full max-w-[500px]">
        <svg
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label="Chart comparing visibility of work vs effort for Frontend and SDET roles"
        >
          <ChartAxes />

          {processedLines.map((line, lineIdx) => (
            <g key={line.name}>
              <path d={line.path} fill="none" stroke={line.color} strokeWidth="3" />
              <text
                x={lineIdx === 0 ? 50 : 40}
                y={lineIdx === 0 ? 25 : 285}
                fontSize="13"
                fill={line.color}
                fontWeight="500"
                fontFamily="Geist Mono, monospace"
              >
                {line.name}
              </text>

              {line.dataPoints.map((point, dotIdx) => {
                const dotId = `${id}-${lineIdx}-${dotIdx}`;
                return (
                  <ChartDot
                    key={dotId}
                    point={point}
                    color={lineIdx === 0 ? AXIS.color : line.color}
                    isActive={activeId === dotId}
                    shouldBlink={!interacted.has(dotId)}
                    onMouseEnter={() => handleEnter(dotId)}
                    onMouseLeave={handleLeave}
                  />
                );
              })}
            </g>
          ))}

          {activePoint && <ChartTooltip point={activePoint.point} position={activePoint.position} />}
        </svg>
      </div>
    </figure>
  );
}
