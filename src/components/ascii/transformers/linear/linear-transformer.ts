import { getRandomChar } from "@/components/ascii/utils/getRandomChar";
import type {
  AsciiTransformer,
  AsciiTransformerParams,
} from "@/components/ascii/transformers/transformer";
import {
  LINEAR_ADVANCE_CHANCE,
  DEFAULT_SCRAMBLE_THROTTLE,
} from "@/components/ascii/transformers/linear/constants";

export interface LinearTransformerOptions extends AsciiTransformerParams {
  scrambleThrottle?: number;
  reverse?: boolean;
}

export class AsciiLinearTransformer implements AsciiTransformer {
  private columnRevealHeights: number[] = [];
  private frameCount = 0;
  private readonly scrambleThrottle: number;
  private readonly reverse: boolean;
  private readonly totalRows: number;

  constructor(params: LinearTransformerOptions) {
    this.scrambleThrottle = params.scrambleThrottle ?? DEFAULT_SCRAMBLE_THROTTLE;
    this.reverse = params.reverse ?? false;

    const lines = params.asciiArt.split("\n");
    const maxCols = Math.max(...lines.map((line) => line.length));
    this.totalRows = lines.length;

    this.columnRevealHeights = new Array(maxCols).fill(0);
  }

  public transform(text: string): string {
    this.frameCount++;

    let allDone = true;
    for (let x = 0; x < this.columnRevealHeights.length; x++) {
      if (this.columnRevealHeights[x] < this.totalRows) {
        allDone = false;
        if (Math.random() < LINEAR_ADVANCE_CHANCE) {
          this.columnRevealHeights[x]++;
        }
      }
    }

    if (allDone) return text;

    const inputLines = text.split("\n");
    const resultLines = inputLines.map((line, y) => {
      const chars = line.split("");
      return chars
        .map((char, x) => {
          const revealY = this.columnRevealHeights[x];

          if (this.reverse) {
            const revealFromY = this.totalRows - revealY;

            if (y < revealFromY) {
              return " ";
            } else if (y === revealFromY) {
              if (char === " ") return " ";
              return this.frameCount % this.scrambleThrottle === 0 ? getRandomChar() : char;
            } else {
              return char;
            }
          } else {
            if (y < revealY) {
              return char;
            } else if (y === revealY) {
              if (char === " ") return " ";
              return this.frameCount % this.scrambleThrottle === 0 ? getRandomChar() : char;
            } else {
              return " ";
            }
          }
        })
        .join("");
    });

    return resultLines.join("\n");
  }
}
