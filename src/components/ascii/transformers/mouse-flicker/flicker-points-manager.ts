import { ASCII_ASPECT_RATIO } from "@/components/ascii/constants/constants";
import type { FlickerPoint } from "@/components/ascii/transformers/mouse-flicker/flicker-point";

export class FlickerPointsManager {
  private flickerPoints: FlickerPoint[] = [];

  public empty(): void {
    this.flickerPoints = [];
  }

  public addFlickerPoint(point: FlickerPoint): void {
    this.flickerPoints.push(point);
  }

  private removeDeadFlickers(): void {
    this.flickerPoints = this.flickerPoints.filter((p) => p.isAlive);
  }

  public updateFlickers(): void {
    this.flickerPoints.forEach((p) => p.render());
    this.removeDeadFlickers();
  }

  public isCharFlickering(x: number, y: number): boolean {
    return this.flickerPoints.some((c) => {
      if (!c.radius) {
        return x === c.x && y === c.y;
      }

      const dx = x - c.x;
      const dy = y - c.y;
      const inCircle = (dx * ASCII_ASPECT_RATIO) ** 2 + dy ** 2 <= (c.radius ?? 0) ** 2;
      return inCircle;
    });
  }
}
