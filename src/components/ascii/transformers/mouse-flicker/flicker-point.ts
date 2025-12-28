export interface FlickerPointParams {
  x: number;
  y: number;
  life: number;
  radius?: number;
}

export class FlickerPoint {
  public readonly x: number;
  public readonly y: number;
  public readonly radius?: number;
  public readonly radiusSq?: number;
  private life: number;

  constructor({ x, y, life, radius }: FlickerPointParams) {
    this.x = x;
    this.y = y;
    this.life = life;
    this.radius = radius;
    this.radiusSq = radius !== undefined ? radius * radius : undefined;
  }

  get isAlive(): boolean {
    return this.life > 0;
  }

  public render(): void {
    this.life--;
  }
}
