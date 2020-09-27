import { useRef, useEffect } from "react";

/**
 * A custom useEffect hook that only triggers on component updates, not on the initial mount
 */
export function useUpdateEffect(effect: () => any, dependencies: any[] = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
    // eslint-disable-next-line
  }, dependencies);
}

/**
 * Allows value references to be synced inside a ref so that the current value can be accessed in a side effect.
 */
export function useCurrentRef<Value>(value: Value): React.MutableRefObject<Value> {
  const currentRef = useRef(value);

  useEffect(() => {
    currentRef.current = value;
  }, [value]);

  return currentRef;
}

/**
 * Basically the same as useCurrentRef but assigns the value when the effect cleans up
 */
export function usePreviousRef<Value>(
  value: Value,
): React.MutableRefObject<Value | undefined> {
  const previousRef = useRef<Value>();

  useEffect(() => {
    return () => {
      previousRef.current = value;
    };
  }, [value]);

  return previousRef;
}
