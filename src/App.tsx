import { useState } from "react";
import { FiltersPanel } from "./components/Filters";
import { PracticeCard } from "./components/PracticeCard";
import { ChallengeMode } from "./components/ChallengeMode";
import { ApiKeySettings } from "./components/ApiKeySettings";
import { FieldMappingPanel } from "./components/FieldMapping";
import { HistoryPanel } from "./components/HistoryPanel";
import { useI18n } from "./i18n";

type Mode = "single" | "challenge";
import { useDecks } from "./hooks/useDecks";
import { useModelNames } from "./hooks/useModelNames";
import { useCards } from "./hooks/useCards";
import { useCardTypes } from "./hooks/useCardTypes";
import { loadConfig } from "./api/llm";
import type { Filters, FieldMapping } from "./types";
import { loadFieldMappings, saveFieldMappings } from "./types";
import "./App.css";

const DEFAULT_FILTERS: Filters = {
  deck: "",
  noteType: "",
  cardTypes: [],
  minInterval: 0,
  maxInterval: 0,
  ratedDays: 0,
};

function App() {
  const { t, lang, setLang } = useI18n();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [wordCount, setWordCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("single");
  const [hasKey, setHasKey] = useState(() => !!loadConfig()?.apiKey);
  const [fieldMappings, setFieldMappings] = useState<Record<string, FieldMapping>>(loadFieldMappings);
  const [showReadmeBanner, setShowReadmeBanner] = useState(true);

  const { decks, error: decksError } = useDecks();
  const { models, error: modelsError } = useModelNames();
  const { cardTypes } = useCardTypes(filters.noteType);
  const { words, loading, error: cardsError, fetchWords } = useCards();

  const connectionError = decksError || modelsError;

  function handleMappingChange(noteType: string, mapping: FieldMapping) {
    const updated = { ...fieldMappings, [noteType]: mapping };
    setFieldMappings(updated);
    saveFieldMappings(updated);
  }

  const canSubmit = !!filters.noteType && !!fieldMappings[filters.noteType]?.word;

  function handleSubmit() {
    if (!canSubmit) return;
    setCurrentIndex(0);
    const mapping = fieldMappings[filters.noteType] ?? null;
    fetchWords(filters, mapping, wordCount);
  }

  const hasNoteType = !!filters.noteType;
  const hasMappedWord = !!fieldMappings[filters.noteType]?.word;

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-logo">文</span>
        <h1>Anki Sentences</h1>
        <span className="subtitle">{t("subtitle")}</span>
        <button
          className="lang-toggle"
          onClick={() => setLang(lang === "en" ? "es" : "en")}
        >
          {lang === "en" ? "ES" : "EN"}
        </button>
      </header>
      {showReadmeBanner && (
        <div className="readme-banner" role="alert">
          <div className="readme-banner-content">
            <strong>Important:</strong> Read the README before you start.{" "}
            <a
              href="https://github.com/FranArnaudo/anki-sentences#readme"
              target="_blank"
              rel="noreferrer"
            >
              github.com/FranArnaudo/anki-sentences
            </a>
          </div>
          <button
            className="readme-banner-close"
            type="button"
            aria-label="Dismiss"
            onClick={() => setShowReadmeBanner(false)}
          >
            ×
          </button>
        </div>
      )}

      {connectionError && (
        <div className="error-banner">
          <strong>{t("cannotConnect")}</strong>
          <p>
            {t("connectionHelp")}{" "}
            <code>http://localhost:5173</code> {t("connectionHelpSuffix")}{" "}
            <code>webCorsOriginList</code> (Anki → Tools → Add-ons →
            AnkiConnect → Config).
          </p>
          <p className="error-detail">{connectionError}</p>
        </div>
      )}

      <div className="layout">
        <aside className="sidebar sidebar-left">
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            onSubmit={handleSubmit}
            decks={decks}
            models={models}
            cardTypes={cardTypes}
            loading={loading}
            wordCount={wordCount}
            onWordCountChange={setWordCount}
            canSubmit={canSubmit}
          />
        </aside>

        <main className="practice-area">
          {cardsError && <div className="error-banner">{cardsError}</div>}

          {words.length === 0 && !loading && (
            <div className="onboarding">
              <div className="onboarding-icon">文</div>
              <h2>{t("getStarted")}</h2>
              <ol className="onboarding-steps">
                <li className={!connectionError ? "step-done" : ""}>
                  <span className="step-num">{!connectionError ? "✓" : "1"}</span>
                  <div>
                    <strong>{t("installAnkiConnect")}</strong>{" "}
                    <span className="step-req">{t("required")}</span>
                    <p>
                      {t("installAnkiConnectDesc")}{" "}
                      <code>2055492159</code>. {t("installAnkiConnectDesc2")}{" "}
                      <code>http://localhost:5173</code>{" "}
                      {t("installAnkiConnectDesc3")}
                    </p>
                  </div>
                </li>
                <li className={hasNoteType ? "step-done" : ""}>
                  <span className="step-num">{hasNoteType ? "✓" : "2"}</span>
                  <div>
                    <strong>{t("pickNoteType")}</strong>{" "}
                    <span className="step-req">{t("required")}</span>
                    <p>{t("pickNoteTypeDesc")}</p>
                  </div>
                </li>
                <li className={hasMappedWord ? "step-done" : ""}>
                  <span className="step-num">{hasMappedWord ? "✓" : "3"}</span>
                  <div>
                    <strong>{t("mapFields")}</strong>{" "}
                    <span className="step-req">{t("required")}</span>
                    <p>{t("mapFieldsDesc")}</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">4</span>
                  <div>
                    <strong>{t("setupFilters")}</strong>{" "}
                    <span className="step-opt">{t("optional")}</span>
                    <p>{t("setupFiltersDesc")}</p>
                  </div>
                </li>
                <li className={hasKey ? "step-done" : ""}>
                  <span className="step-num">{hasKey ? "✓" : "5"}</span>
                  <div>
                    <strong>{t("addApiKey")}</strong>{" "}
                    <span className="step-opt">{t("optional")}</span>
                    <p>{t("addApiKeyDesc")}</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">6</span>
                  <div>
                    <strong>{t("getWordsStep")}</strong>
                    <p>{t("getWordsStepDesc")}</p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {words.length > 0 && (
            <>
              <div className="mode-toggle">
                <button
                  className={mode === "single" ? "mode-active" : ""}
                  onClick={() => setMode("single")}
                >
                  {t("oneAtATime")}
                </button>
                <button
                  className={mode === "challenge" ? "mode-active" : ""}
                  onClick={() => setMode("challenge")}
                >
                  {t("allInOne")}
                </button>
              </div>

              {mode === "single" ? (
                <PracticeCard
                  key={words[currentIndex].cardId}
                  word={words[currentIndex]}
                  index={currentIndex}
                  total={words.length}
                  hasKey={hasKey}
                  onNext={() =>
                    setCurrentIndex((i) => Math.min(i + 1, words.length - 1))
                  }
                  onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                />
              ) : (
                <ChallengeMode words={words} hasKey={hasKey} />
              )}
            </>
          )}
        </main>

        <aside className="sidebar sidebar-right">
          <FieldMappingPanel
            noteType={filters.noteType}
            mapping={filters.noteType ? fieldMappings[filters.noteType] ?? null : null}
            onMappingChange={handleMappingChange}
          />
          <ApiKeySettings onKeyChange={setHasKey} />
          <HistoryPanel />
        </aside>
      </div>
    </div>
  );
}

export default App;
