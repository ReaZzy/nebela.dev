export interface AsciiImagePresenter {
  updateUi(asciiArt: string): void;
}

export interface AsciiAnimationStrategyParams {
  asciiArt: string;
  presenter: AsciiImagePresenter;
}

export interface AsciiAnimationStrategy {
  animate(): Promise<void>;
  stop(): void;
  update?(): void;
  apply?(text: string): string;
}

export type AsciiAnimationStrategyConstructor<
  Params extends AsciiAnimationStrategyParams = AsciiAnimationStrategyParams,
> = new (parameters: Params) => AsciiAnimationStrategy;

export function createAsciiAnimationStrategy<
  Params extends AsciiAnimationStrategyParams,
>(
  StrategyClass: AsciiAnimationStrategyConstructor<Params>,
  parameters: Params,
): AsciiAnimationStrategy {
  return new StrategyClass(parameters);
}
