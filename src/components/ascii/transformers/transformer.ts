export interface AsciiTransformerParams {
  asciiArt: string;
}

export interface TransformerEvents {
  mouseMove: { x: number; y: number };
  mouseLeave: void;
}

export interface AsciiTransformer {
  transform(text: string): string;
  onMouseMove?(data: { x: number; y: number }): void;
  onMouseLeave?(): void;
}
