import { useEffect, useRef } from "react";
import { AnimationController } from "@/utils/animation-controller";

export function useAnimationController(callback: () => void, fps: number, paused = false) {
  const controllerRef = useRef<AnimationController | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const controller = new AnimationController(() => {
      callbackRef.current();
    }, fps);

    controllerRef.current = controller;
    if (!paused) {
      controller.start();
    }

    return () => {
      controller.stop();
      controllerRef.current = null;
    };
  }, [fps]);

  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller) return;

    if (paused) {
      controller.pause();
    } else {
      controller.resume();
    }
  }, [paused]);

  return controllerRef;
}
