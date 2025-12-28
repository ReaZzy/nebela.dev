import { getRandomChar } from "../utils/getRandomChar";
import { AnimationController } from "./animation-controller";
import type {
  AsciiAnimationStrategy,
  AsciiAnimationStrategyParams,
  AsciiImagePresenter,
} from "./ascii-animation-strategy";

export class AsciiLinearAnimationStrategy implements AsciiAnimationStrategy {
  private readonly asciiArt: string;
  private readonly presenter: AsciiImagePresenter;
  private encryptionController: AnimationController | null = null;
  private lineController: AnimationController | null = null;

  private isRevealFinished = false;
  private resolvePromise: (() => void) | null = null;
  private rejectPromise: ((reason?: any) => void) | null = null;

  private currentLineIndex: number;
  private encryptedCurrentLine = "";
  private lastUpdateTime = 0;
  private lineTimer = 0;
  private encryptionTimer = 0;

  constructor({ presenter, asciiArt }: AsciiAnimationStrategyParams) {
    this.asciiArt = asciiArt;
    this.presenter = presenter;
    const lines = asciiArt.split("\n");
    this.currentLineIndex = lines.length - 1;
  }

  private scramble(text: string | undefined): string {
    if (!text) return "";
    return text.split("").reduce((acc, char) => {
      if (char === " ") return acc + " ";
      return acc + getRandomChar();
    }, "");
  }

  public update(): void {
    if (this.isRevealFinished) return;

    const now = performance.now();
    if (this.lastUpdateTime === 0) {
      this.lastUpdateTime = now;
      return;
    }

    const delta = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    this.lineTimer += delta;
    this.encryptionTimer += delta;

    const lineInterval = 1000 / 96;
    const encryptionInterval = 1000 / 12;

    const lines = this.asciiArt.split("\n");

    if (this.encryptionTimer > encryptionInterval) {
      this.encryptionTimer = 0;
      this.encryptedCurrentLine = this.scramble(lines[this.currentLineIndex]);
    }

    if (this.lineTimer > lineInterval) {
      while (this.lineTimer > lineInterval && this.currentLineIndex >= 0) {
        this.lineTimer -= lineInterval;
        this.currentLineIndex--;
        if (this.currentLineIndex >= 0) {
          this.encryptedCurrentLine = this.scramble(lines[this.currentLineIndex]);
        }
      }

      if (this.currentLineIndex < 0) {
        this.isRevealFinished = true;
        this.finish();
      }
    }
  }

  public apply(text: string): string {
    const lines = text.split("\n");
    const revealedLines = lines.slice(this.currentLineIndex + 1);

    if (this.currentLineIndex >= 0 && this.currentLineIndex < lines.length) {
      return [this.encryptedCurrentLine, ...revealedLines].join("\n");
    } else {
      if (this.isRevealFinished) return text;
      return revealedLines.join("\n");
    }
  }

  public async animate(): Promise<void> {
    this.stop();
    this.isRevealFinished = false;
    this.lastUpdateTime = performance.now();

    const animationPromise = new Promise<void>((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });

    const lineFps = 96;
    const encryptionFps = 12;
    const lines = this.asciiArt.split("\n");
    this.currentLineIndex = lines.length - 1;

    const render = () => {
      this.presenter.updateUi(""); // Trigger chain update
    };

    this.encryptionController = new AnimationController(() => {
      if (this.isRevealFinished) return;
      this.encryptedCurrentLine = this.scramble(lines[this.currentLineIndex]);
      render();
    }, encryptionFps);

    this.lineController = new AnimationController(() => {
      this.currentLineIndex--;

      if (this.currentLineIndex < 0) {
        this.isRevealFinished = true;
        this.finish();
        return;
      }

      this.encryptedCurrentLine = this.scramble(lines[this.currentLineIndex]);
      render();
    }, lineFps);

    this.encryptedCurrentLine = this.scramble(lines[this.currentLineIndex]);
    render();

    this.encryptionController.start();
    this.lineController.start();

    return animationPromise;
  }

  private finish() {
    if (this.resolvePromise) {
      this.resolvePromise();
      this.resolvePromise = null;
      this.stop();
    }
  }

  public stop() {
    this.encryptionController?.stop();
    this.lineController?.stop();
    this.encryptionController = null;
    this.lineController = null;
    this.isRevealFinished = false;

    if (this.rejectPromise) {
      this.rejectPromise(new Error("Animation aborted"));
      this.rejectPromise = null;
      this.resolvePromise = null;
    }
  }
}
