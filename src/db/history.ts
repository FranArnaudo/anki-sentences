import type { Provider } from "../api/llm";

const DB_NAME = "anki-sentences";
const DB_VERSION = 1;
const STORE_NAME = "history";

export type HistoryMode = "single" | "challenge";

export interface HistoryEntry {
  id?: number;
  word: string;
  sentence: string;
  response: string;
  hint?: string;
  createdAt: number;
  lang: string;
  provider: Provider;
  model: string;
  mode?: HistoryMode;
  cardId?: number;
}

export type HistoryEntryInput = Omit<HistoryEntry, "id">;

let dbPromise: Promise<IDBDatabase> | null = null;

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) {
    return Promise.reject(new Error("IndexedDB not available"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("createdAt", "createdAt");
        store.createIndex("word", "word");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted"));
    tx.onerror = () => reject(tx.error ?? new Error("Transaction error"));
  });
}

export async function addHistoryEntry(
  entry: HistoryEntryInput,
): Promise<number | null> {
  if (!hasIndexedDb()) return null;
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const id = await requestToPromise<IDBValidKey>(store.add(entry));
  await transactionDone(tx);
  return typeof id === "number" ? id : null;
}

export async function getHistory(limit = 100): Promise<HistoryEntry[]> {
  if (!hasIndexedDb()) return [];
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const index = store.index("createdAt");

  return new Promise((resolve, reject) => {
    const results: HistoryEntry[] = [];
    const request = index.openCursor(null, "prev");

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor || results.length >= limit) {
        resolve(results);
        return;
      }
      results.push(cursor.value as HistoryEntry);
      cursor.continue();
    };

    request.onerror = () => reject(request.error);

    tx.onabort = () => reject(tx.error ?? new Error("Transaction aborted"));
    tx.onerror = () => reject(tx.error ?? new Error("Transaction error"));
  });
}

export async function clearHistory(): Promise<void> {
  if (!hasIndexedDb()) return;
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).clear();
  await transactionDone(tx);
}
