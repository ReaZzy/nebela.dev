export interface Point {
  x: number;
  y: number;
}

export interface DataPoint extends Point {
  label?: string;
}

export interface LineConfig {
  points: Point[];
  color: string;
  name: string;
  dots: { x: number; label?: string }[];
}

export interface ProcessedLine extends LineConfig {
  path: string;
  dataPoints: DataPoint[];
}
