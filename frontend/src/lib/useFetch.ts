'use client';

type CacheEntry<T> =
  | { status: 'pending'; promise: Promise<void> }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

const cache = new Map<string, CacheEntry<unknown>>();

export function useFetch<T>(key: string, fetcher: () => Promise<T>): T {
  let entry = cache.get(key) as CacheEntry<T> | undefined;

  if (!entry) {
    const promise = fetcher()
      .then((data) => {
        cache.set(key, { status: 'success', data });
      })
      .catch((error) => {
        cache.set(key, { status: 'error', error });
      });
    entry = { status: 'pending', promise };
    cache.set(key, entry);
  }

  if (entry.status === 'pending') throw entry.promise;
  if (entry.status === 'error') throw entry.error;
  return entry.data;
}

export function clearFetchCache() {
  cache.clear();
}
