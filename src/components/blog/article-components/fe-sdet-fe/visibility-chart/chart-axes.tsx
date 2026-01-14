import { CHART, AXIS } from "./constants";

export function ChartAxes() {
  const { left, top } = CHART.padding;
  const bottom = CHART.height - CHART.padding.bottom;
  const right = CHART.width - CHART.padding.right;

  return (
    <>
      <line x1={left} y1={top} x2={left} y2={bottom} stroke={AXIS.color} strokeWidth={AXIS.strokeWidth} />
      <polygon
        points={`${left},${top - AXIS.arrowSize} ${left - AXIS.arrowSize},${top + AXIS.arrowSize} ${left + AXIS.arrowSize},${top + AXIS.arrowSize}`}
        fill={AXIS.color}
      />

      <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={AXIS.color} strokeWidth={AXIS.strokeWidth} />
      <polygon
        points={`${right + AXIS.arrowSize},${bottom} ${right - AXIS.arrowSize},${bottom - AXIS.arrowSize} ${right - AXIS.arrowSize},${bottom + AXIS.arrowSize}`}
        fill={AXIS.color}
      />

      <text
        x="10"
        y="170"
        fontSize="12"
        fill={AXIS.color}
        transform="rotate(-90, 10, 160)"
        textAnchor="middle"
        fontFamily="Geist Mono, monospace"
      >
        {AXIS.labels.y}
      </text>
      <text
        x={CHART.width / 2}
        y={CHART.height - 2}
        fontSize="12"
        fill={AXIS.color}
        fontFamily="Geist Mono, monospace"
        textAnchor="middle"
      >
        {AXIS.labels.x}
      </text>
    </>
  );
}
