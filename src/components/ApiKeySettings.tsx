import { useState, useEffect } from "react";
import {
  type Provider,
  MODELS,
  saveConfig,
  loadConfig,
  clearConfig,
} from "../api/llm";
import { useI18n } from "../i18n";

const PROVIDERS: { value: Provider; label: string }[] = [
  { value: "gemini", label: "Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "claude", label: "Claude" },
];

interface ApiKeySettingsProps {
  onKeyChange: (hasKey: boolean) => void;
}

export function ApiKeySettings({ onKeyChange }: ApiKeySettingsProps) {
  const { t } = useI18n();
  const [provider, setProvider] = useState<Provider>("gemini");
  const [model, setModel] = useState(MODELS.gemini[0]);
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const config = loadConfig();
    if (config) {
      setProvider(config.provider);
      setModel(config.model || MODELS[config.provider][0]);
      setApiKey(config.apiKey);
      setSaved(true);
    }
  }, []);

  function handleSave() {
    saveConfig({ provider, apiKey, model });
    setSaved(true);
    onKeyChange(true);
  }

  function handleClear() {
    clearConfig();
    setApiKey("");
    setSaved(false);
    onKeyChange(false);
  }

  return (
    <div className="api-settings">
      <h2>{t("sentenceChecker")}</h2>
      <p className="helper-text">
        {t("apiKeyHelperPre")}{" "}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noreferrer"
        >
          {t("getGeminiKey")}
        </a>
        . Use <strong>gemini-2.5-flash</strong> {t("apiKeyHelperPost")}
      </p>

      <label>
        {t("provider")}
        <select
          value={provider}
          onChange={(e) => {
            const newProvider = e.target.value as Provider;
            setProvider(newProvider);
            setModel(MODELS[newProvider][0]);
            setSaved(false);
          }}
        >
          {PROVIDERS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        {t("model")}
        <select
          value={model}
          onChange={(e) => {
            setModel(e.target.value);
            setSaved(false);
          }}
        >
          {MODELS[provider].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>

      <label>
        {t("apiKey")}
        <input
          type="password"
          value={apiKey}
          placeholder={t("pasteApiKey")}
          onChange={(e) => {
            setApiKey(e.target.value);
            setSaved(false);
          }}
        />
      </label>

      <div className="api-actions">
        <button onClick={handleSave} disabled={!apiKey}>
          {saved ? t("saved") : t("save")}
        </button>
        {saved && (
          <button className="btn-secondary" onClick={handleClear}>
            {t("clear")}
          </button>
        )}
      </div>
    </div>
  );
}
