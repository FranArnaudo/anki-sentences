import { useEffect, useState } from "react";
import { clearHistory, getHistory, type HistoryEntry } from "../db/history";
import { useI18n } from "../i18n";

export function HistoryPanel() {
  const { t } = useI18n();
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory(100);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "History error");
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    await clearHistory();
    await load();
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>{t("history")}</h3>
        <div className="history-actions">
          <button className="btn-secondary" onClick={load} disabled={loading}>
            {t("refresh")}
          </button>
          <button className="btn-secondary" onClick={handleClear}>
            {t("clear")}
          </button>
        </div>
      </div>

      {error && <div className="history-error">{error}</div>}

      {items.length === 0 && !loading && (
        <p className="history-empty">{t("historyEmpty")}</p>
      )}

      <div className="history-list">
        {items.map((entry) => (
          <div key={entry.id} className="history-item">
            <div className="history-meta">
              <span className="history-word">{entry.word}</span>
              <span className="history-time">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="history-sentence">{entry.sentence}</div>
            <pre className="history-response">{entry.response}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
