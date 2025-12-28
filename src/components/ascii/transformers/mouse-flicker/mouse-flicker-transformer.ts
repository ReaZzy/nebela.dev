import { getRandomChar } from "@/components/ascii/utils/getRandomChar";
import type {
  AsciiTransformer,
  AsciiTransformerParams,
} from "@/components/ascii/transformers/transformer";
import { FLICKER_SCRAMBLE_CHANCE } from "@/components/ascii/transformers/flicker/constants";
import { ASCII_ASPECT_RATIO } from "@/components/ascii/constants/constants";
import { FlickerPointsManager } from "@/components/ascii/transformers/mouse-flicker/flicker-points-manager";
import {
  FlickerPoint,
  type FlickerPointParams,
} from "@/components/ascii/transformers/mouse-flicker/flicker-point";
import {
  MOUSE_HOVER_MAX_DISTANCE,
  MOUSE_FLICKER_RADIUS,
  MOUSE_FLICKER_LIFE,
} from "@/components/ascii/transformers/mouse-flicker/constants";

export class MouseFlickerTransformer implements AsciiTransformer {
  private readonly flickerPointsManager = new FlickerPointsManager();
  private validFlickerCoordinates: Map<number, Set<number>> = new Map();
  private mousePosition: { x: number; y: number } | null = null;

  constructor(params: AsciiTransformerParams) {
    const lines = params.asciiArt.split("\n");

    const maxDistSq = MOUSE_HOVER_MAX_DISTANCE * MOUSE_HOVER_MAX_DISTANCE;
    const searchBoundX = Math.ceil(MOUSE_HOVER_MAX_DISTANCE / ASCII_ASPECT_RATIO);
    const searchBoundY = MOUSE_HOVER_MAX_DISTANCE;

    const validOffsets: Array<{ dx: number; dy: number }> = [];
    for (let dy = -searchBoundY; dy <= searchBoundY; dy++) {
      for (let dx = -searchBoundX; dx <= searchBoundX; dx++) {
        const dxScaled = dx * ASCII_ASPECT_RATIO;
        if (dxScaled * dxScaled + dy * dy <= maxDistSq) {
          validOffsets.push({ dx, dy });
        }
      }
    }

    lines.forEach((line: string, y: number) => {
      line.split("").forEach((char: string, x: number) => {
        if (char !== " ") {
          for (const offset of validOffsets) {
            const targetY = y + offset.dy;
            const targetX = x + offset.dx;

            const rowSet = this.validFlickerCoordinates.get(targetY) ?? new Set();
            if (!this.validFlickerCoordinates.has(targetY)) {
              this.validFlickerCoordinates.set(targetY, rowSet);
            }
            rowSet.add(targetX);
          }
        }
      });
    });
  }

  private spawnFlicker({ x, y, radius, life }: FlickerPointParams): void {
    this.flickerPointsManager.addFlickerPoint(new FlickerPoint({ x, y, radius, life }));
  }

  private isValidFlickerCoordinate(x: number, y: number): boolean {
    const rowSet = this.validFlickerCoordinates.get(y);
    return rowSet ? rowSet.has(x) : false;
  }

  private updateAnimations(): void {
    this.flickerPointsManager.updateFlickers();

    if (
      this.mousePosition &&
      this.isValidFlickerCoordinate(this.mousePosition.x, this.mousePosition.y)
    ) {
      const jitter = Math.random() * 6 - 2;
      this.spawnFlicker({
        x: this.mousePosition.x,
        y: this.mousePosition.y,
        radius: MOUSE_FLICKER_RADIUS + jitter,
        life: MOUSE_FLICKER_LIFE,
      });
    }
  }

  public onMouseMove(data: { x: number; y: number }): void {
    this.mousePosition = data;
  }

  public onMouseLeave(): void {
    this.mousePosition = null;
  }

  public transform(text: string): string {
    this.updateAnimations();

    const lines = text.split("\n");
    return lines
      .map((line, y) => {
        const rowSet = this.validFlickerCoordinates.get(y);
        if (!rowSet) return line;

        return line
          .split("")
          .map((char, x) => {
            if (!rowSet.has(x)) {
              return char;
            }

            if (this.flickerPointsManager.isCharFlickering(x, y)) {
              if (Math.random() < FLICKER_SCRAMBLE_CHANCE) {
                return " ";
              }
              return getRandomChar();
            }

            return char;
          })
          .join("");
      })
      .join("\n");
  }
}
