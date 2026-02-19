const ANKI_CONNECT_URL = "http://localhost:8765";
const ANKI_CONNECT_VERSION = 6;
const EXTENSION_TIMEOUT_MS = 3000;

interface AnkiResponse<T = unknown> {
  result: T;
  error: string | null;
}

export async function invoke<T = unknown>(
  action: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  if (window.location.protocol === "https:") {
    return invokeViaExtension<T>(action, params);
  }

  return invokeViaHttp<T>(action, params);
}

async function invokeViaHttp<T = unknown>(
  action: string,
  params: Record<string, unknown>
): Promise<T> {
  const response = await fetch(ANKI_CONNECT_URL, {
    method: "POST",
    body: JSON.stringify({ action, version: ANKI_CONNECT_VERSION, params }),
  });

  const data: AnkiResponse<T> = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.result;
}

async function invokeViaExtension<T = unknown>(
  action: string,
  params: Record<string, unknown>
): Promise<T> {
  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(
        new Error(
          "AnkiConnect browser extension not detected. Install the bridge extension to connect from GitHub Pages."
        )
      );
    }, EXTENSION_TIMEOUT_MS);

    function cleanup() {
      window.clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);
    }

    function handleMessage(event: MessageEvent) {
      if (event.source !== window) return;
      const message = event.data;
      if (!message || message.type !== "ANKI_CONNECT_RESPONSE") return;
      if (message.id !== requestId) return;

      cleanup();

      if (message.error) {
        reject(new Error(message.error));
        return;
      }

      resolve(message.result as T);
    }

    window.addEventListener("message", handleMessage);

    window.postMessage(
      {
        type: "ANKI_CONNECT_REQUEST",
        id: requestId,
        action,
        version: ANKI_CONNECT_VERSION,
        params,
      },
      "*"
    );
  });
}

export async function getDeckNames(): Promise<string[]> {
  return invoke<string[]>("deckNames");
}

export async function getModelNames(): Promise<string[]> {
  return invoke<string[]>("modelNames");
}

export interface CardInfo {
  cardId: number;
  fields: Record<string, { value: string; order: number }>;
  fieldOrder: number;
  modelName: string;
  deckName: string;
  interval: number;
  note: number;
  type: number;
  queue: number;
  reps: number;
  lapses: number;
}

export async function getModelFieldNames(
  modelName: string
): Promise<string[]> {
  return invoke<string[]>("modelFieldNames", { modelName });
}

export async function getModelTemplates(
  modelName: string
): Promise<Record<string, unknown>> {
  return invoke<Record<string, unknown>>("modelTemplates", { modelName });
}

export async function findCards(query: string): Promise<number[]> {
  return invoke<number[]>("findCards", { query });
}

export async function getCardsInfo(cards: number[]): Promise<CardInfo[]> {
  return invoke<CardInfo[]>("cardsInfo", { cards });
}
