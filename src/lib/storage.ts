import { STORAGE_KEYS } from './storageKeys';

const DB_NAME = 'mentor-mind-storage';
const DB_VERSION = 1;
const STORE_NAME = 'items';

function isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeParse<T>(raw: string | null): T | null {
    if (raw === null) {
        return null;
    }

    try {
        return JSON.parse(raw) as T;
    } catch (error) {
        console.warn(`[storage] Failed to parse value for localStorage fallback:`, error);
        return null;
    }
}

function safeStringify(value: unknown): string {
    return JSON.stringify(value);
}

async function openDatabase(): Promise<IDBDatabase | null> {
    if (!isBrowser() || typeof window.indexedDB === 'undefined') {
        return null;
    }

    return await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getFromIndexedDb<T>(key: string): Promise<T | null> {
    const database = await openDatabase();
    if (!database) {
        return null;
    }

    return await new Promise<T | null>((resolve) => {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
        request.onerror = () => resolve(null);
    });
}

async function setInIndexedDb<T>(key: string, value: T): Promise<void> {
    const database = await openDatabase();
    if (!database) {
        return;
    }

    await new Promise<void>((resolve) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
    });
}

async function removeFromIndexedDb(key: string): Promise<void> {
    const database = await openDatabase();
    if (!database) {
        return;
    }

    await new Promise<void>((resolve) => {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
    });
}

export async function get<T>(key: string): Promise<T | null> {
    if (!isBrowser()) {
        return null;
    }

    try {
        const fromIndexedDb = await getFromIndexedDb<T>(key);
        if (fromIndexedDb !== null) {
            return fromIndexedDb;
        }

        const fallbackValue = getSync<T>(key);
        if (fallbackValue !== null) {
            await set(key, fallbackValue);
            return fallbackValue;
        }

        return null;
    } catch (error) {
        console.warn(`[storage] Failed to read value for key "${key}":`, error);
        return getSync<T>(key);
    }
}

export function getSync<T>(key: string): T | null {
    if (!isBrowser()) {
        return null;
    }

    try {
        const storedValue = window.localStorage.getItem(key);
        return safeParse<T>(storedValue);
    } catch (error) {
        console.warn(`[storage] Failed to read sync value for key "${key}":`, error);
        return null;
    }
}

export async function set<T>(key: string, value: T): Promise<void> {
    if (!isBrowser()) {
        return;
    }

    try {
        await setInIndexedDb(key, value);
    } catch (error) {
        console.warn(`[storage] Failed to persist to IndexedDB for key "${key}":`, error);
    }

    try {
        window.localStorage.setItem(key, safeStringify(value));
    } catch (error) {
        console.warn(`[storage] Failed to persist to localStorage for key "${key}":`, error);
    }
}

export function setSync<T>(key: string, value: T): void {
    if (!isBrowser()) {
        return;
    }

    try {
        window.localStorage.setItem(key, safeStringify(value));
    } catch (error) {
        console.warn(`[storage] Failed to persist sync value for key "${key}":`, error);
    }
}

export async function remove(key: string): Promise<void> {
    if (!isBrowser()) {
        return;
    }

    try {
        await removeFromIndexedDb(key);
    } catch (error) {
        console.warn(`[storage] Failed to remove value from IndexedDB for key "${key}":`, error);
    }

    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn(`[storage] Failed to remove value from localStorage for key "${key}":`, error);
    }
}

export function removeSync(key: string): void {
    if (!isBrowser()) {
        return;
    }

    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.warn(`[storage] Failed to remove sync value for key "${key}":`, error);
    }
}

export function getStorageKey(key: keyof typeof STORAGE_KEYS): string {
    return STORAGE_KEYS[key];
}
