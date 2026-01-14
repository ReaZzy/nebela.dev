import type { Point } from "./types";

function sampleBezier(p0: Point, cp1: Point, cp2: Point, p1: Point, samples: number): Point[] {
  const points: Point[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    points.push({
      x: mt3 * p0.x + 3 * mt2 * t * cp1.x + 3 * mt * t2 * cp2.x + t3 * p1.x,
      y: mt3 * p0.y + 3 * mt2 * t * cp1.y + 3 * mt * t2 * cp2.y + t3 * p1.y,
    });
  }

  return points;
}

function getControlPoints(p0: Point, p1: Point, p2: Point, p3: Point) {
  return {
    cp1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
    cp2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
  };
}

export function sampleCurve(linePoints: Point[], samplesPerSegment = 20): Point[] {
  if (linePoints.length < 2) return linePoints;

  const allPoints: Point[] = [linePoints[0]];

  for (let i = 0; i < linePoints.length - 1; i++) {
    const p0 = linePoints[i - 1] ?? linePoints[i];
    const p1 = linePoints[i];
    const p2 = linePoints[i + 1];
    const p3 = linePoints[i + 2] ?? p2;

    const { cp1, cp2 } = getControlPoints(p0, p1, p2, p3);
    const segment = sampleBezier(p1, cp1, cp2, p2, samplesPerSegment);
    allPoints.push(...segment.slice(1));
  }

  return allPoints;
}

export function createSmoothPath(points: Point[]): string {
  if (points.length < 2) return "";

  const segments = [`M ${points[0].x} ${points[0].y}`];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const { cp1, cp2 } = getControlPoints(p0, p1, p2, p3);
    segments.push(`C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`);
  }

  return segments.join(" ");
}

export function getYAtX(sampledPoints: Point[], x: number): number {
  for (let i = 0; i < sampledPoints.length - 1; i++) {
    const p1 = sampledPoints[i];
    const p2 = sampledPoints[i + 1];

    if (x >= p1.x && x <= p2.x) {
      const t = (x - p1.x) / (p2.x - p1.x);
      return p1.y + t * (p2.y - p1.y);
    }
  }

  return x < sampledPoints[0].x ? sampledPoints[0].y : sampledPoints[sampledPoints.length - 1].y;
}
