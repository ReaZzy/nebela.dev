import { createFromConstructor, type Constructor } from "@/utils/infrastructure/classes";
import {
  type AsciiTransformer,
  type AsciiTransformerParams,
  type TransformerEvents,
} from "@/components/ascii/transformers/transformer";

export interface TransformerConfig<
  Params extends AsciiTransformerParams = AsciiTransformerParams,
  Transformer extends AsciiTransformer = AsciiTransformer,
  TransformerConstructor extends Constructor<Params, Transformer> = Constructor<
    Params,
    Transformer
  >,
> {
  transformer: TransformerConstructor;
  options: Omit<Params, "asciiArt"> & { fps?: number };
}

export interface AsciiPipeTransformerParams<
  Params extends AsciiTransformerParams[] = AsciiTransformerParams[],
  Transformers extends AsciiTransformer[] = AsciiTransformer[],
  Constructors extends Constructor<Params[number], Transformers[number]>[] = Constructor<
    Params[number],
    Transformers[number]
  >[],
> {
  asciiArt: string;
  transformers: TransformerConfig<Params[number], Transformers[number], Constructors[number]>[];
}

interface TransformerState<
  Params extends AsciiTransformerParams[] = AsciiTransformerParams[],
  Transformers extends AsciiTransformer[] = AsciiTransformer[],
  Constructors extends Constructor<Params[number], Transformers[number]>[] = Constructor<
    Params[number],
    Transformers[number]
  >[],
> {
  instance: InstanceType<Constructors[number]>;
  throttleFactor: number;
  lastOutput: string;
}

export class AsciiPipeTransformer<
  Params extends AsciiTransformerParams[] = AsciiTransformerParams[],
  Transformers extends AsciiTransformer[] = AsciiTransformer[],
  Constructors extends Constructor<Params[number], Transformers[number]>[] = Constructor<
    Params[number],
    Transformers[number]
  >[],
> implements AsciiTransformer {
  public readonly fps: number;
  private readonly asciiArt: string;
  private transformerStates: TransformerState<Params, Transformers, Constructors>[] = [];
  private globalFrameCount = 0;

  constructor({
    asciiArt,
    transformers,
  }: AsciiPipeTransformerParams<Params, Transformers, Constructors>) {
    this.asciiArt = asciiArt;
    this.fps = Math.max(...transformers.map((t) => t.options.fps || 0), 1);

    this.transformerStates = transformers.map((config) => {
      const instance = createFromConstructor(config.transformer, {
        ...config.options,
        asciiArt: this.asciiArt,
      });

      return {
        instance,
        throttleFactor: Math.max(1, Math.round(this.fps / (config.options.fps || this.fps))),
        lastOutput: this.asciiArt,
      };
    });
  }

  public transform(text: string): string {
    this.globalFrameCount = (this.globalFrameCount + 1) % this.fps;

    return this.transformerStates.reduce((currentInput, state) => {
      if (this.globalFrameCount % state.throttleFactor === 0) {
        state.lastOutput = state.instance.transform(currentInput);
      }

      return state.lastOutput;
    }, text);
  }

  public emit<K extends keyof TransformerEvents>(event: K, data: TransformerEvents[K]): void {
    const eventHandlerName = `on${event.charAt(0).toUpperCase()}${event.slice(1)}` as const;

    this.transformerStates.forEach((state) => {
      const handler = state.instance[eventHandlerName as keyof typeof state.instance];
      if (typeof handler === "function") {
        handler.call(state.instance, data);
      }
    });
  }
}
