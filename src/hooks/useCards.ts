import { useState } from "react";
import { findCards, getCardsInfo } from "../api/ankiConnect";
import type { Filters, FieldMapping, PracticeWord } from "../types";

function buildQuery(filters: Filters): string {
  const parts: string[] = [];

  if (filters.deck) {
    parts.push(`deck:"${filters.deck}"`);
  }
  if (filters.noteType) {
    parts.push(`note:"${filters.noteType}"`);
  }
  if (filters.cardTypes.length > 0) {
    const cardQuery = filters.cardTypes
      .map((cardType) => `card:"${cardType}"`)
      .join(" or ");
    parts.push(filters.cardTypes.length > 1 ? `(${cardQuery})` : cardQuery);
  }
  if (filters.minInterval > 0) {
    parts.push(`prop:ivl>=${filters.minInterval}`);
  }
  if (filters.maxInterval > 0) {
    parts.push(`prop:ivl<=${filters.maxInterval}`);
  }
  if (filters.ratedDays > 0) {
    parts.push(`rated:${filters.ratedDays}`);
  }

  return parts.join(" ") || "deck:current";
}

function getField(
  fields: Record<string, { value: string; order: number }>,
  name: string
): string {
  return fields[name]?.value ?? "";
}

export function useCards() {
  const [words, setWords] = useState<PracticeWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWords(
    filters: Filters,
    fieldMapping: FieldMapping | null,
    count: number = 5
  ) {
    setLoading(true);
    setError(null);

    try {
      const query = buildQuery(filters);
      const cardIds = await findCards(query);

      if (cardIds.length === 0) {
        setWords([]);
        return;
      }

      // Shuffle and take a subset to avoid fetching too many card details
      const shuffled = [...cardIds].sort(() => Math.random() - 0.5);
      const selectionCount = Math.min(
        cardIds.length,
        Math.max(count * 4, count)
      );
      const selected = shuffled.slice(0, selectionCount);

      const cardsInfo = await getCardsInfo(selected);

      const seenNotes = new Set<number>();
      const practiceWords: PracticeWord[] = [];

      for (const card of cardsInfo) {
        if (seenNotes.has(card.note)) continue;
        seenNotes.add(card.note);

        const word = fieldMapping?.word
          ? getField(card.fields, fieldMapping.word)
          : Object.values(card.fields).sort((a, b) => a.order - b.order)[0]
              ?.value ?? "";
        const meaning = fieldMapping?.meaning
          ? getField(card.fields, fieldMapping.meaning)
          : "";
        const furigana = fieldMapping?.furigana
          ? getField(card.fields, fieldMapping.furigana)
          : "";

        if (word) {
          practiceWords.push({ cardId: card.cardId, word, meaning, furigana });
        }
        if (practiceWords.length >= count) break;
      }

      setWords(practiceWords);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return { words, loading, error, fetchWords };
}
