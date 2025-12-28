import { FPS_FLICKER } from "../transformers/flicker/constants";
import { AsciiFlickerTransformer } from "../transformers/flicker/flicker-transformer";
import { FPS_LINEAR } from "../transformers/linear/constants";
import { AsciiLinearTransformer } from "../transformers/linear/linear-transformer";
import { FPS_MOUSE_FLICKER } from "../transformers/mouse-flicker/constants";
import { MouseFlickerTransformer } from "../transformers/mouse-flicker/mouse-flicker-transformer";

export const ASCII_TRANSFORMER_PRESETS = {
  default: [
    { transformer: AsciiFlickerTransformer, options: { fps: FPS_FLICKER } },
    {
      transformer: MouseFlickerTransformer,
      options: { fps: FPS_MOUSE_FLICKER },
    },
    {
      transformer: AsciiLinearTransformer,
      options: { fps: FPS_LINEAR, reverse: false },
    },
  ],
  "no-flicker": [
    {
      transformer: MouseFlickerTransformer,
      options: { fps: FPS_MOUSE_FLICKER },
    },
    {
      transformer: AsciiLinearTransformer,
      options: { fps: FPS_LINEAR, reverse: false },
    },
  ],
  static: [],
  reverse: [
    { transformer: AsciiFlickerTransformer, options: { fps: FPS_FLICKER } },
    {
      transformer: MouseFlickerTransformer,
      options: { fps: FPS_MOUSE_FLICKER },
    },
    {
      transformer: AsciiLinearTransformer,
      options: { fps: FPS_LINEAR, reverse: true },
    },
  ],
  "no-flicker-reverse": [
    {
      transformer: MouseFlickerTransformer,
      options: { fps: FPS_MOUSE_FLICKER },
    },
    {
      transformer: AsciiLinearTransformer,
      options: { fps: FPS_LINEAR, reverse: true },
    },
  ],
} as const;

export type TransformerPreset = keyof typeof ASCII_TRANSFORMER_PRESETS;
