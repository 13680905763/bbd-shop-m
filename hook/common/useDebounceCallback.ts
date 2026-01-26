import { useCallback, useEffect, useRef } from "react";

import { debounce } from "@/lib/debounce";

/**
 * 一个简单的 useDebounceCallback hook
 * @param fn 需要防抖的函数
 * @param delay 延迟时间 (ms)
 * @param deps 依赖数组
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  fn: T,
  delay = 500,
  deps: any[] = [],
) {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const debounced = useCallback(
    debounce((...args: Parameters<T>) => {
      fnRef.current(...args);
    }, delay),
    [delay, ...deps],
  );

  return debounced;
}
