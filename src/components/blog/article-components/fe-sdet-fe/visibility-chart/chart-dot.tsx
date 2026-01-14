import type { DataPoint } from "./types";
import { DOT } from "./constants";

interface ChartDotProps {
  point: DataPoint;
  color: string;
  isActive: boolean;
  shouldBlink: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function ChartDot({
  point,
  color,
  isActive,
  shouldBlink,
  onMouseEnter,
  onMouseLeave,
}: ChartDotProps) {
  const radius = isActive ? DOT.radius.active : DOT.radius.default;

  return (
    <circle
      cx={point.x}
      cy={point.y}
      r={radius}
      fill={color}
      className="cursor-pointer transition-all duration-150"
      style={
        shouldBlink
          ? { animation: "blink 1.5s ease-in-out infinite", transformOrigin: `${point.x}px ${point.y}px` }
          : undefined
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onMouseEnter}
      onTouchEnd={onMouseLeave}
    />
  );
}
