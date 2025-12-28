import { getRandomChar } from "@/components/ascii/utils/getRandomChar";
import { perlin3D } from "@/components/ascii/utils/perlin";
import type {
  AsciiTransformer,
  AsciiTransformerParams,
} from "@/components/ascii/transformers/transformer";
import { BLANK_CHANCE, FLICKER_THRESHOLD, NOISE_SCALE, TIME_SCALE } from "./constants";

export class AsciiFlickerTransformer implements AsciiTransformer {
  private validFlickerCoordinates: Map<number, Set<number>> = new Map();
  private time = 0;

  constructor(params: AsciiTransformerParams) {
    const lines = params.asciiArt.split("\n");
    lines.forEach((line: string, y: number) => {
      line.split("").forEach((char: string, x: number) => {
        if (char !== " ") {
          const rowSet = this.validFlickerCoordinates.get(y) ?? new Set();
          if (!this.validFlickerCoordinates.has(y)) {
            this.validFlickerCoordinates.set(y, rowSet);
          }
          rowSet.add(x);
        }
      });
    });
  }

  public transform(text: string): string {
    this.time += TIME_SCALE;

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

            const noise = perlin3D(x * NOISE_SCALE, y * NOISE_SCALE, this.time);

            if (noise > FLICKER_THRESHOLD) {
              if (Math.random() < BLANK_CHANCE) {
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
