import { getRandomChar } from "../utils/getRandomChar";
import { AnimationController } from "./animation-controller";
import type {
  AsciiAnimationStrategy,
  AsciiAnimationStrategyParams,
  AsciiImagePresenter,
} from "./ascii-animation-strategy";

export class AsciiFlickerAnimationStrategy implements AsciiAnimationStrategy {
  private readonly asciiArt: string;
  private readonly presenter: AsciiImagePresenter;
  private flickeringController: AnimationController | null = null;

  private readonly flickerPointsManager = new FlickerPointsManager();
  private nonSpaceCoordinates: { x: number; y: number }[] = [];
  private validFlickerCoordinates: Set<string> = new Set();

  constructor({ presenter, asciiArt }: AsciiAnimationStrategyParams) {
    this.asciiArt = asciiArt;
    this.presenter = presenter;

    const lines = asciiArt.split("\n");
    lines.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        if (char !== " ") {
          this.nonSpaceCoordinates.push({ x, y });

          // Mark coordinates within radius 2 as valid for flickering
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (dx * dx + dy * dy <= 5) {
                this.validFlickerCoordinates.add(`${x + dx},${y + dy}`);
              }
            }
          }
        }
      });
    });
  }

  private updateFlickers() {
    this.flickerPointsManager.updateFlickers();

    if (Math.random() < 0.3 && this.nonSpaceCoordinates.length > 0) {
      const seed =
        this.nonSpaceCoordinates[
          Math.floor(Math.random() * this.nonSpaceCoordinates.length)
        ];
      this.flickerPointsManager.addFlickerPoint(
        new FlickerPoint({
          x: seed.x,
          y: seed.y,
          radius: Math.floor(Math.random() * 4),
          life: Math.floor(Math.random() * 8) + 4,
        }),
      );
    }
  }

  private applyFlicker(lines: string[]): string {
    return lines
      .map((line, y) => {
        return line
          .split("")
          .map((char, x) => {
            if (!this.validFlickerCoordinates.has(`${x},${y}`)) {
              return char;
            }

            if (this.flickerPointsManager.isCharFlickering(x, y)) {
              return getRandomChar();
            }

            return char;
          })
          .join("");
      })
      .join("\n");
  }

  public update(): void {
    this.updateFlickers();
  }

  public apply(text: string): string {
    const lines = text.split("\n");
    return this.applyFlicker(lines);
  }

  public async animate(): Promise<void> {
    this.stop();

    this.flickeringController = new AnimationController(() => {
      this.update();
      const finalOutput = this.apply(this.asciiArt);
      this.presenter.updateUi(finalOutput);
    }, 12);

    this.flickeringController.start();

    return Promise.resolve();
  }

  public stop() {
    this.flickeringController?.stop();
    this.flickeringController = null;

    this.flickerPointsManager.empty();
  }
}

class FlickerPointsManager {
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
      const inCircle = dx ** 2 + dy ** 2 <= (c.radius ?? 0) ** 2;
      return inCircle;
    });
  }
}

interface FlickerPointParams {
  x: number;
  y: number;
  life: number;
  radius?: number;
}

class FlickerPoint {
  public readonly x: number;
  public readonly y: number;
  public readonly radius?: number;
  private life: number;

  constructor({ x, y, life, radius }: FlickerPointParams) {
    this.x = x;
    this.y = y;
    this.life = life;
    this.radius = radius;
  }

  get isAlive(): boolean {
    return this.life > 0;
  }

  public render(): void {
    this.life--;
  }
}
