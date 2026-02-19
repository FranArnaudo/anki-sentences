import { useState, type ReactNode } from "react";
import { checkSentenceWithMeta, runCustomPrompt } from "../api/llm";
import { addHistoryEntry } from "../db/history";
import { useI18n } from "../i18n";

interface CorrectionButtonProps {
  word: string;
  sentence: string;
  hasKey: boolean;
  cardId?: number;
  mode?: "single" | "challenge";
  onClearSentence?: () => void;
}

function parseCorrectionLine(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = line;
  let key = 0;

  const markers = [
    { open: "【", close: "】", cls: "fix-changed" },
    { open: "〈", close: "〉", cls: "fix-added" },
    { open: "｛", close: "｝", cls: "fix-removed" },
  ];

  while (remaining.length > 0) {
    let earliest = -1;
    let matchedMarker: (typeof markers)[0] | null = null;

    for (const marker of markers) {
      const idx = remaining.indexOf(marker.open);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matchedMarker = marker;
      }
    }

    if (earliest === -1 || !matchedMarker) {
      parts.push(remaining);
      break;
    }

    if (earliest > 0) {
      parts.push(remaining.slice(0, earliest));
    }

    const closeIdx = remaining.indexOf(
      matchedMarker.close,
      earliest + matchedMarker.open.length,
    );
    if (closeIdx === -1) {
      parts.push(remaining.slice(earliest));
      break;
    }

    const inner = remaining.slice(
      earliest + matchedMarker.open.length,
      closeIdx,
    );
    parts.push(
      <span key={key++} className={matchedMarker.cls}>
        {inner}
      </span>,
    );
    remaining = remaining.slice(closeIdx + matchedMarker.close.length);
  }

  return parts;
}

function Tip({ text }: { text: string }) {
  return (
    <span className="tip-wrapper">
      <span className="tip-icon">?</span>
      <span className="tip-bubble">{text}</span>
    </span>
  );
}

export function CorrectionButton({
  word,
  sentence,
  hasKey,
  cardId,
  mode = "single",
  onClearSentence,
}: CorrectionButtonProps) {
  const { t, lang } = useI18n();
  const [correction, setCorrection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCheck() {
    setLoading(true);
    setError(null);
    setCorrection(null);
    setExplanation(null);
    try {
      const result = await checkSentenceWithMeta(word, sentence, lang, hint);
      setCorrection(result.text);
      void addHistoryEntry({
        word,
        sentence,
        response: result.text,
        hint: hint.trim() || undefined,
        createdAt: Date.now(),
        lang,
        provider: result.provider,
        model: result.model,
        mode,
        cardId,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "LLM error");
    } finally {
      setLoading(false);
    }
  }

  function handleClearInputs() {
    setHint("");
    setCorrection(null);
    setExplanation(null);
    setError(null);
    onClearSentence?.();
  }

  const explainPrompt =
    lang === "es"
      ? `Sos un tutor de japonés. Explicá de forma breve por qué se hizo cada corrección.

Kanji/palabra dada: ${word}
Oración del estudiante: ${sentence}
Lo que quiso decir (resumen): ${hint.trim() || "No especificado"}
Corrección del LLM: ${correction ?? ""}

Explicá cada cambio línea por línea. Sé conciso.`
      : `You are a Japanese tutor. Briefly explain why each correction was made.

Word given: ${word}
Student sentence: ${sentence}
Intended meaning (summary): ${hint.trim() || "Not specified"}
LLM correction: ${correction ?? ""}

Explain each change line by line. Keep it concise.`;

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(explainPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  async function handleExplain() {
    if (!correction) return;
    setExplainLoading(true);
    try {
      const result = await runCustomPrompt(explainPrompt);
      setExplanation(result.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "LLM error");
    } finally {
      setExplainLoading(false);
    }
  }

  if (!hasKey) return null;

  const isCorrect = correction?.trimStart().startsWith("✓");

  return (
    <div className="correction-section">
      <label className="correction-hint-label">
        <span className="label-row">
          {t("correctionHint")}
          <Tip text={t("correctionHintTip")} />
        </span>
        <textarea
          className="correction-hint-input"
          placeholder={t("correctionHintPlaceholder")}
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          rows={2}
        />
      </label>

      <div className="correction-actions">
        <button onClick={handleCheck} disabled={loading || !sentence.trim()}>
          {loading ? t("checking") : t("check")}
        </button>
        <button className="btn-secondary" onClick={handleClearInputs}>
          {t("clearInputs")}
        </button>
      </div>

      {error && <div className="correction-error">{error}</div>}

      {correction && (
        <div
          className={`correction-result ${isCorrect ? "correction-correct" : "correction-has-fixes"}`}
        >
          {correction.split("\n").map((line, i) => (
            <div key={i}>{isCorrect ? line : parseCorrectionLine(line)}</div>
          ))}
        </div>
      )}

      {correction && (
        <div className="correction-followup">
          <div className="correction-followup-header">
            <h4>{t("explainPromptTitle")}</h4>
            <div className="correction-followup-actions">
              <button className="btn-secondary" onClick={handleCopyPrompt}>
                {copied ? t("copied") : t("copyPrompt")}
              </button>
              <button onClick={handleExplain} disabled={explainLoading}>
                {explainLoading ? t("checking") : t("sendToLlm")}
              </button>
            </div>
          </div>
          <textarea
            className="correction-followup-text"
            value={explainPrompt}
            readOnly
            rows={6}
          />
          {explanation && (
            <div className="correction-followup-response">{explanation}</div>
          )}
        </div>
      )}
    </div>
  );
}
