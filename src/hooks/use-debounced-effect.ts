
import { useEffect, useRef } from 'react';

/**
 * A hook that runs an effect with debouncing to avoid multiple rapid executions
 * @param effect The function to run
 * @param delay The delay time in milliseconds
 * @param deps The dependency array, similar to useEffect
 */
export const useDebouncedEffect = (
  effect: () => void | (() => void),
  delay: number,
  deps: React.DependencyList = []
) => {
  const callback = useRef<() => void | (() => void)>(effect);

  useEffect(() => {
    callback.current = effect;
  }, [effect]);

  useEffect(() => {
    const handler = setTimeout(() => {
      callback.current();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
};

export default useDebouncedEffect;
