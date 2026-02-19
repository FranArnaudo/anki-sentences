export interface Filters {
  deck: string;
  noteType: string;
  cardTypes: string[];
  minInterval: number;
  maxInterval: number;
  ratedDays: number;
}

export interface PracticeWord {
  cardId: number;
  word: string;
  meaning: string;
  furigana: string;
}

export interface FieldMapping {
  word: string;
  meaning: string;
  furigana: string;
}

const FIELD_MAPPING_KEY = "anki-sentences-field-mappings";

export function saveFieldMappings(
  mappings: Record<string, FieldMapping>
): void {
  localStorage.setItem(FIELD_MAPPING_KEY, JSON.stringify(mappings));
}

export function loadFieldMappings(): Record<string, FieldMapping> {
  const raw = localStorage.getItem(FIELD_MAPPING_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
