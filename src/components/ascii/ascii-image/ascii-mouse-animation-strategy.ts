import { getRandomChar } from "../utils/getRandomChar";
import { AnimationController } from "./animation-controller";
import type {
    AsciiAnimationStrategy,
    AsciiAnimationStrategyParams,
    AsciiImagePresenter,
} from "./ascii-animation-strategy";

export class AsciiMouseAnimationStrategy implements AsciiAnimationStrategy {
    private readonly asciiArt: string;
    private readonly presenter: AsciiImagePresenter;
    private animationController: AnimationController | null = null;
    private mouseX: number | null = null;
    private mouseY: number | null = null;
    private validFlickerCoordinates: Set<string> = new Set();

    constructor({ presenter, asciiArt }: AsciiAnimationStrategyParams) {
        this.asciiArt = asciiArt;
        this.presenter = presenter;

        const lines = asciiArt.split("\n");
        lines.forEach((line, y) => {
            line.split("").forEach((char, x) => {
                if (char !== " ") {
                    this.validFlickerCoordinates.add(`${x},${y}`);
                }
            });
        });
    }

    public updateMousePos(x: number | null, y: number | null) {
        this.mouseX = x;
        this.mouseY = y;
    }

    private applyMouseEffect(lines: string[]): string {
        return lines
            .map((line, y) => {
                return line
                    .split("")
                    .map((char, x) => {
                        if (!this.validFlickerCoordinates.has(`${x},${y}`)) {
                            return char;
                        }

                        let inMouseCircle = false;
                        if (this.mouseX !== null && this.mouseY !== null) {
                            const dx = x - this.mouseX;
                            const dy = y - this.mouseY;
                            if (dx * dx + dy * dy <= 8 * 8) {
                                // Add some randomness to the mouse circle
                                if (Math.random() < 0.7) {
                                    inMouseCircle = true;
                                }
                            }
                        }

                        if (inMouseCircle) {
                            return getRandomChar();
                        }

                        return char;
                    })
                    .join("");
            })
            .join("\n");
    }

    public update(): void {
        // No internal state to update, simply reacts to mouse pos
    }

    public apply(text: string): string {
        const lines = text.split("\n");
        return this.applyMouseEffect(lines);
    }

    public async animate(): Promise<void> {
        this.stop();

        // Note: AsciiMouseAnimationStrategy usually runs as part of a pipe now
        // But if run standalone:
        this.animationController = new AnimationController(() => {
            // In standalone mode, we apply effect to the base art
            const finalOutput = this.apply(this.asciiArt);
            this.presenter.updateUi(finalOutput);
        }, 24);

        this.animationController.start();

        return Promise.resolve();
    }

    public stop() {
        this.animationController?.stop();
        this.animationController = null;
        this.mouseX = null;
        this.mouseY = null;
    }
}
