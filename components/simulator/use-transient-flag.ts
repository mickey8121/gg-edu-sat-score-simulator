"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// A boolean that flips true on trigger() and auto-resets to false after
// durationMs, with cleanup on unmount and re-trigger. Used for the no-toast
// success-feedback pattern: render an Alert conditioned on the returned flag,
// next to whatever triggered it.
export const useTransientFlag = (durationMs: number): [boolean, () => void] => {
  const [flag, setFlag] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const trigger = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    setFlag(true);
    timeoutRef.current = window.setTimeout(() => {
      setFlag(false);
      timeoutRef.current = null;
    }, durationMs);
  }, [durationMs]);

  return [flag, trigger];
};
