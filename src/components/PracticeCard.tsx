import { useState } from "react";
import type { PracticeWord } from "../types";
import { CorrectionButton } from "./CorrectionButton";
import { useI18n } from "../i18n";

interface PracticeCardProps {
  word: PracticeWord;
  index: number;
  total: number;
  hasKey: boolean;
  onNext: () => void;
  onPrev: () => void;
}

export function PracticeCard({
  word,
  index,
  total,
  hasKey,
  onNext,
  onPrev,
}: PracticeCardProps) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState("");
  const [showHint, setShowHint] = useState(false);

  const hasHint = word.meaning || word.furigana;

  return (
    <div className="practice-card">
      <div className="card-progress">
        {index + 1} / {total}
      </div>

      <div className="card-word">{word.word}</div>

      {showHint && hasHint && (
        <div className="card-hint">
          {word.furigana && (
            <div className="hint-reading">{word.furigana}</div>
          )}
          {word.meaning && (
            <div className="hint-meaning">{word.meaning}</div>
          )}
        </div>
      )}

      <textarea
        className="sentence-input"
        placeholder={t("writeSentence")}
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        rows={3}
      />

      <CorrectionButton
        word={word.word}
        sentence={sentence}
        hasKey={hasKey}
        cardId={word.cardId}
        mode="single"
        onClearSentence={() => setSentence("")}
      />

      <div className="card-actions">
        {hasHint && (
          <button
            className="btn-secondary"
            onClick={() => setShowHint((h) => !h)}
          >
            {showHint ? t("hideHint") : t("showHint")}
          </button>
        )}
      </div>

      <div className="card-nav">
        <button onClick={onPrev} disabled={index === 0}>
          {t("previous")}
        </button>
        <button onClick={onNext} disabled={index === total - 1}>
          {t("next")}
        </button>
      </div>
    </div>
  );
}
