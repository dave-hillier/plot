import {useEffect, useState} from "react";

const cache = new Map<string, unknown[]>();
const pending = new Map<string, Promise<unknown[]>>();
const empty: never[] = [];

// Returns [] until the dataset loads, then re-renders with the rows. The
// loader runs at most once per key; concurrent callers share the promise.
export function useDataset<T>(key: string, load: () => Promise<T[]>): T[] {
  const [data, setData] = useState<T[]>(() => (cache.get(key) as T[] | undefined) ?? empty);
  useEffect(() => {
    if (cache.has(key)) return;
    let promise = pending.get(key) as Promise<T[]> | undefined;
    if (!promise) {
      promise = load().then((rows) => {
        cache.set(key, rows);
        pending.delete(key);
        return rows;
      });
      pending.set(key, promise);
    }
    let cancelled = false;
    promise.then((rows) => {
      if (!cancelled) setData(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);
  return data;
}
