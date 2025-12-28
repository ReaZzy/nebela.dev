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

    const lines = this.asciiArt.split("\n");

    // Just one step per call
    this.currentLineIndex--;

    if (this.currentLineIndex < 0) {
      this.isRevealFinished = true;
      this.finish();
    } else {
      this.encryptedCurrentLine = this.scramble(lines[this.currentLineIndex]);
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

    const animationPromise = new Promise<void>((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });

    const lineFps = 96;
    const encryptionFps = 12;
    const lines = this.asciiArt.split("\n");
    this.currentLineIndex = lines.length - 1;

    const render = () => {
      // Sequential mode: we can call presenter directly or trigger chain
      // If it's sequential, it's the start of the chain or standalone.
      // Using empty string in updateUi to trigger stage republish if used in pipe.
      this.presenter.updateUi("");
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
