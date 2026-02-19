import type { Filters } from "../types";
import { useI18n } from "../i18n";

interface FiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onSubmit: () => void;
  decks: string[];
  models: string[];
  cardTypes: string[];
  loading: boolean;
  wordCount: number;
  onWordCountChange: (count: number) => void;
  canSubmit: boolean;
}

function Tip({ text }: { text: string }) {
  return (
    <span className="tip-wrapper">
      <span className="tip-icon">?</span>
      <span className="tip-bubble">{text}</span>
    </span>
  );
}

export function FiltersPanel({
  filters,
  onChange,
  onSubmit,
  decks,
  models,
  cardTypes,
  loading,
  wordCount,
  onWordCountChange,
  canSubmit,
}: FiltersProps) {
  const { t } = useI18n();
  const isAllCardTypes = filters.cardTypes.length === 0;

  function toggleCardType(cardType: string) {
    if (isAllCardTypes) {
      onChange({ ...filters, cardTypes: [cardType] });
      return;
    }
    if (filters.cardTypes.includes(cardType)) {
      onChange({
        ...filters,
        cardTypes: filters.cardTypes.filter((t) => t !== cardType),
      });
      return;
    }
    onChange({ ...filters, cardTypes: [...filters.cardTypes, cardType] });
  }

  return (
    <div className="filters-panel">
      <h2>{t("filters")}</h2>

      <label>
        <span className="label-row">
          {t("deck")}
          <Tip text={t("tipDeck")} />
        </span>
        <select
          value={filters.deck}
          onChange={(e) => onChange({ ...filters, deck: e.target.value })}
        >
          <option value="">{t("allDecks")}</option>
          {decks.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="label-row">
          {t("noteType")} <span className="label-req">*</span>
          <Tip text={t("tipNoteType")} />
        </span>
        <select
          value={filters.noteType}
          onChange={(e) =>
            onChange({ ...filters, noteType: e.target.value, cardTypes: [] })
          }
        >
          <option value="">{t("selectNoteType")}</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      {filters.noteType && cardTypes.length > 0 && (
        <label>
          <span className="label-row">
            {t("cardType")}
            <Tip text={t("tipCardType")} />
          </span>
          <div className="card-type-filter">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAllCardTypes}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    cardTypes: e.target.checked
                      ? []
                      : cardTypes.length > 0
                        ? [cardTypes[0]]
                        : [],
                  })
                }
              />
              {t("allCardTypes")}
            </label>
            {!isAllCardTypes && (
              <div className="card-type-list">
                {cardTypes.map((c) => (
                  <label key={c} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.cardTypes.includes(c)}
                      onChange={() => toggleCardType(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
            {isAllCardTypes && (
              <p className="card-type-hint">{t("cardTypeHint")}</p>
            )}
          </div>
        </label>
      )}

      <label>
        <span className="label-row">
          {t("maxInterval")}
          <Tip text={t("tipMaxInterval")} />
        </span>
        <input
          type="number"
          min={0}
          value={filters.maxInterval}
          onChange={(e) =>
            onChange({ ...filters, maxInterval: Number(e.target.value) })
          }
        />
      </label>

      <label>
        <span className="label-row">
          {t("minInterval")}
          <Tip text={t("tipMinInterval")} />
        </span>
        <input
          type="number"
          min={0}
          value={filters.minInterval}
          onChange={(e) =>
            onChange({ ...filters, minInterval: Number(e.target.value) })
          }
        />
      </label>

      <label>
        <span className="label-row">
          {t("reviewedInLastN")}
          <Tip text={t("tipReviewedDays")} />
        </span>
        <input
          type="number"
          min={0}
          value={filters.ratedDays}
          onChange={(e) =>
            onChange({ ...filters, ratedDays: Number(e.target.value) })
          }
        />
      </label>

      <label>
        <span className="label-row">
          {t("wordsToPractice")}
          <Tip text={t("tipWordCount")} />
        </span>
        <input
          type="number"
          min={1}
          max={50}
          value={wordCount}
          onChange={(e) => onWordCountChange(Number(e.target.value))}
        />
      </label>

      <button onClick={onSubmit} disabled={loading || !canSubmit}>
        {loading ? t("loading") : t("getWords")}
      </button>
      {!canSubmit && (
        <p className="filter-hint">{t("filterHint")}</p>
      )}
    </div>
  );
}
