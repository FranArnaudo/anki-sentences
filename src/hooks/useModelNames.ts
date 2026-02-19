import { useState, useEffect } from "react";
import { getModelNames } from "../api/ankiConnect";

export function useModelNames() {
  const [models, setModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelNames()
      .then(setModels)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { models, error, loading };
}
