import { useRef, useLayoutEffect, useCallback } from "react";

export function useEvent<Args extends unknown[], Ret>(
  handler: (...args: Args) => Ret
) {
  const handlerRef = useRef<null | ((...args: Args) => Ret)>(null);

  // In a real implementation, this would run before layout effects
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Args) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current;
    return fn?.(...args);
  }, []);
}
