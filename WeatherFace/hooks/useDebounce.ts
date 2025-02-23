import { useRef, useEffect, useCallback } from 'react';

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;

export function useDebounce<Func extends SomeFunction>(
  func: Func,
  delay = 1000,
) {
  const timer = useRef<Timer>();

  useEffect(() => {
    return () => {
      if (!timer.current) return;
      clearTimeout(timer.current);
    };
  }, []);

  const debouncedFunction = useCallback(
    (...args: any) => {
      const newTimer = setTimeout(() => {
        func(...args);
      }, delay);
      clearTimeout(timer.current);
      timer.current = newTimer;
    },
    [delay, func],
  );

  return debouncedFunction;
}
