import { useState, useEffect } from "react";
import { getDeckNames } from "../api/ankiConnect";

export function useDecks() {
  const [decks, setDecks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDeckNames()
      .then(setDecks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { decks, error, loading };
}
