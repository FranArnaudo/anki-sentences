import { useEffect, useState } from "react";
import { getModelTemplates } from "../api/ankiConnect";

export function useCardTypes(noteType: string) {
  const [cardTypes, setCardTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!noteType) {
      setCardTypes([]);
      return;
    }

    let cancelled = false;
    setError(null);

    getModelTemplates(noteType)
      .then((templates) => {
        if (cancelled) return;
        const names = Object.keys(templates || {});
        setCardTypes(names);
      })
      .catch((e) => {
        if (cancelled) return;
        setCardTypes([]);
        setError(e instanceof Error ? e.message : "Unknown error");
      });

    return () => {
      cancelled = true;
    };
  }, [noteType]);

  return { cardTypes, error };
}
