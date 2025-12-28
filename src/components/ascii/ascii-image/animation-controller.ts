export class AnimationController {
  private requestId: number | null = null;
  private lastFrameTime = 0;
  private readonly interval: number;

  constructor(
    private callback: () => void,
    fps: number
  ) {
    this.interval = 1000 / fps;
  }

  public start() {
    this.lastFrameTime = performance.now();
    this.loop();
  }

  public stop() {
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }

  private loop = () => {
    this.requestId = requestAnimationFrame(this.loop);
    const now = performance.now();
    const delta = now - this.lastFrameTime;

    if (delta > this.interval) {
      this.lastFrameTime = now - (delta % this.interval);
      this.callback();
    }
  };
}
