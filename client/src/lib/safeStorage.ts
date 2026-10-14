/**
 * localStorage wrapper that never throws.
 *
 * Private browsing modes and some in-app browsers (WhatsApp, Instagram) throw
 * a SecurityError on any storage access, or expose no storage at all. A throw
 * before React renders leaves a blank page, so every read returns null and
 * every write is a no-op when storage is unavailable.
 */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function browserStorage(): KeyValueStorage | null {
  try {
    return typeof window !== "undefined" && window.localStorage ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function createSafeStorage(getBackend: () => KeyValueStorage | null = browserStorage): KeyValueStorage {
  return {
    getItem(key) {
      try {
        return getBackend()?.getItem(key) ?? null;
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      try {
        getBackend()?.setItem(key, value);
      } catch {
        // storage full or blocked: the app works without persistence
      }
    },
    removeItem(key) {
      try {
        getBackend()?.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

export const safeStorage = createSafeStorage();
