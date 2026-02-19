import { useState } from "react";
import type { PracticeWord } from "../types";
import { CorrectionButton } from "./CorrectionButton";
import { useI18n } from "../i18n";

interface ChallengeModeProps {
  words: PracticeWord[];
  hasKey: boolean;
}

export function ChallengeMode({ words, hasKey }: ChallengeModeProps) {
  const { t } = useI18n();
  const [sentence, setSentence] = useState("");
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set());

  function toggleReveal(cardId: number) {
    setRevealedWords((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }

  return (
    <div className="practice-card">
      <div className="challenge-header">
        {t("useAllWordsPre")}{" "}
        <strong>
          {t("useAllWordsAll")} {words.length} {t("useAllWords")}
        </strong>{" "}
        {t("useAllWordsPost")}
      </div>

      <div className="challenge-words">
        {words.map((w) => {
          const revealed = revealedWords.has(w.cardId);
          return (
            <button
              key={w.cardId}
              className="challenge-word-chip"
              onClick={() => toggleReveal(w.cardId)}
              title={t("clickToReveal")}
            >
              <span className="chip-kanji">{w.word}</span>
              {revealed && (w.meaning || w.furigana) && (
                <span className="chip-hint">
                  {[w.furigana, w.meaning].filter(Boolean).join(" — ")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <textarea
        className="sentence-input"
        placeholder={t("writeSentenceAll")}
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        rows={5}
      />

      <CorrectionButton
        word={words.map((w) => w.word).join("、")}
        sentence={sentence}
        hasKey={hasKey}
        mode="challenge"
        onClearSentence={() => setSentence("")}
      />
    </div>
  );
}
