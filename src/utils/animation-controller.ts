export class AnimationController {
  private requestId: number | null = null;
  private lastFrameTime = 0;
  private readonly interval: number;
  private isPaused = false;

  constructor(
    private callback: () => void,
    fps: number
  ) {
    this.interval = 1000 / fps;
  }

  public start() {
    if (this.isPaused) return;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  public stop() {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }

  public pause() {
    this.isPaused = true;
    this.stop();
  }

  public resume() {
    this.isPaused = false;
    if (this.requestId === null) {
      this.lastFrameTime = performance.now();
      this.loop();
    }
  }

  private loop = () => {
    if (this.isPaused) return;
    this.requestId = requestAnimationFrame(this.loop);
    const now = performance.now();
    const delta = now - this.lastFrameTime;

    if (delta > this.interval) {
      this.lastFrameTime = now - (delta % this.interval);
      this.callback();
    }
  };
}
