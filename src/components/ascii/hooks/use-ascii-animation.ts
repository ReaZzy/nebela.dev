import { useState, useMemo, useCallback, useEffect } from "react";
import {
  AsciiPipeTransformer,
  type TransformerConfig,
} from "../transformers/pipe/pipe-transformer";
import { useAnimationController } from "@/hooks/use-animation-controller";
import type {
  AsciiTransformer,
  AsciiTransformerParams,
  TransformerEvents,
} from "../transformers/transformer";
import type { Constructor } from "@/utils/infrastructure/classes";

export function useAsciiAnimation<
  Params extends AsciiTransformerParams[] = AsciiTransformerParams[],
  Transformers extends AsciiTransformer[] = AsciiTransformer[],
  Constructors extends Constructor<Params[number], Transformers[number]>[] = Constructor<
    Params[number],
    Transformers[number]
  >[],
>(
  transformers: TransformerConfig<Params[number], Transformers[number], Constructors[number]>[],
  asciiArt: string,
  paused = false
) {
  const { pipe, initialContent } = useMemo(() => {
    if (!asciiArt) return { pipe: null, initialContent: "" };
    const p = new AsciiPipeTransformer<Params, Transformers, Constructors>({
      asciiArt,
      transformers,
    });
    return { pipe: p, initialContent: "" };
  }, [transformers, asciiArt]);

  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  useAnimationController(
    () => {
      if (!pipe) return;
      const result = pipe.transform(asciiArt);
      setContent(result);
    },
    pipe?.fps || 30,
    paused
  );

  const emit = useCallback(
    <K extends keyof TransformerEvents>(event: K, data: TransformerEvents[K]) => {
      if (pipe) {
        pipe.emit(event, data);
      }
    },
    [pipe]
  );

  return { content, emit };
}
