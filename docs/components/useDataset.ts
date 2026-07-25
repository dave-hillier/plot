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

const resourceCache = new Map<string, unknown>();
const resourcePending = new Map<string, Promise<unknown>>();

// Like useDataset, but for a single resource (e.g. a GeoJSON feature): returns
// null until it loads, then re-renders with the value.
export function useResource<T>(key: string, load: () => Promise<T>): T | null {
  const [value, setValue] = useState<T | null>(() => (resourceCache.get(key) as T | undefined) ?? null);
  useEffect(() => {
    if (resourceCache.has(key)) return;
    let promise = resourcePending.get(key) as Promise<T> | undefined;
    if (!promise) {
      promise = load().then((v) => {
        resourceCache.set(key, v);
        resourcePending.delete(key);
        return v;
      });
      resourcePending.set(key, promise);
    }
    let cancelled = false;
    promise.then((v) => {
      if (!cancelled) setValue(v);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);
  return value;
}
