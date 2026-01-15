import type { DataPoint } from "./types";
import { CHART, TOOLTIP } from "./constants";
import { wrapText } from "./text";

interface ChartTooltipProps {
  point: DataPoint;
  position: "above" | "below";
  bg?: string;
  border?: string;
  text?: string;
}

export function ChartTooltip({
  point,
  position,
  bg = TOOLTIP.bg,
  border = TOOLTIP.border,
  text = TOOLTIP.text,
}: ChartTooltipProps) {
  if (!point.label) return null;

  const lines = wrapText(point.label, TOOLTIP.maxCharsPerLine);
  const maxLineLength = Math.max(...lines.map((l) => l.length));

  const boxWidth = maxLineLength * TOOLTIP.charWidth + TOOLTIP.padding * 2;
  const boxHeight = lines.length * TOOLTIP.lineHeight + TOOLTIP.padding * 2;

  const tooltipY =
    position === "above"
      ? point.y - boxHeight - TOOLTIP.arrowSize - TOOLTIP.offset
      : point.y + TOOLTIP.arrowSize + TOOLTIP.offset;

  const tooltipX = Math.max(10, Math.min(point.x - boxWidth / 2, CHART.width - 10 - boxWidth));

  const arrowY = position === "above" ? tooltipY + boxHeight : tooltipY;
  const arrowPoints =
    position === "above"
      ? `${point.x},${arrowY + TOOLTIP.arrowSize} ${point.x - TOOLTIP.arrowSize},${arrowY} ${point.x + TOOLTIP.arrowSize},${arrowY}`
      : `${point.x},${arrowY - TOOLTIP.arrowSize} ${point.x - TOOLTIP.arrowSize},${arrowY} ${point.x + TOOLTIP.arrowSize},${arrowY}`;

  const coverY = position === "above" ? tooltipY + boxHeight - 4 : tooltipY;

  return (
    <g className="animate-in fade-in-0 zoom-in-95 duration-150">
      <rect
        x={tooltipX}
        y={tooltipY}
        width={boxWidth}
        height={boxHeight}
        fill={bg}
        stroke={border}
        strokeWidth="1"
        rx="4"
      />
      <polygon points={arrowPoints} fill={bg} stroke={border} strokeWidth="1" />
      <rect x={tooltipX} y={coverY} width={boxWidth} height="6" fill={bg} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={tooltipX + TOOLTIP.padding}
          y={tooltipY + TOOLTIP.padding + TOOLTIP.lineHeight * (i + 0.75)}
          fontSize="14"
          fill={text}
          fontFamily="Geist Mono, monospace"
        >
          {line}
        </text>
      ))}
    </g>
  );
}
