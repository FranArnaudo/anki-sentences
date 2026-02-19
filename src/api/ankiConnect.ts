const ANKI_CONNECT_URL = "http://localhost:8765";
const ANKI_CONNECT_VERSION = 6;

interface AnkiResponse<T = unknown> {
  result: T;
  error: string | null;
}

export async function invoke<T = unknown>(
  action: string,
  params: Record<string, unknown> = {}
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
