import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "es";

const translations = {
  // Header
  subtitle: {
    en: "Practice making Japanese sentences",
    es: "Practica creando oraciones en japonés",
  },

  // Error banner
  cannotConnect: {
    en: "Cannot connect to AnkiConnect.",
    es: "No se puede conectar a AnkiConnect.",
  },
  connectionHelp: {
    en: "Make sure Anki is running with AnkiConnect installed, and that",
    es: "Asegurate de que Anki esté abierto con AnkiConnect instalado, y que",
  },
  connectionHelpSuffix: {
    en: "is in your",
    es: "esté en tu",
  },

  // Filters
  filters: { en: "Filters", es: "Filtros" },
  deck: { en: "Deck", es: "Mazo" },
  allDecks: { en: "All decks", es: "Todos los mazos" },
  noteType: { en: "Note type", es: "Tipo de nota" },
  selectNoteType: { en: "Select a note type", es: "Seleccionar tipo de nota" },
  cardType: { en: "Card type(s)", es: "Tipo(s) de tarjeta" },
  allCardTypes: { en: "All card types", es: "Todos los tipos de tarjeta" },
  cardTypeHint: {
    en: "Uncheck to select specific types.",
    es: "Desmarcá para elegir tipos específicos.",
  },
  maxInterval: { en: "Max interval (days)", es: "Intervalo máximo (días)" },
  minInterval: { en: "Min interval (days)", es: "Intervalo mínimo (días)" },
  reviewedInLastN: { en: "Reviewed in last N days", es: "Revisadas en los últimos N días" },
  wordsToPractice: { en: "Words to practice", es: "Palabras a practicar" },
  getWords: { en: "Get Words", es: "Obtener palabras" },
  loading: { en: "Loading...", es: "Cargando..." },
  filterHint: {
    en: "Select a note type and map the word field first.",
    es: "Seleccioná un tipo de nota y mapeá el campo de palabra primero.",
  },

  // Filter tooltips
  tipDeck: {
    en: "Choose an Anki deck to pull cards from, or leave on 'All decks' to use every deck.",
    es: "Elegí un mazo de Anki del cual sacar cartas, o dejá en 'Todos los mazos' para usar todos.",
  },
  tipNoteType: {
    en: "The Anki note type to practice. Required so the app knows which fields to read.",
    es: "El tipo de nota de Anki para practicar. Obligatorio para que la app sepa qué campos leer.",
  },
  tipCardType: {
    en: "Limit to specific card templates (e.g. Recognition vs Production). Leave empty for all.",
    es: "Limitá a plantillas específicas (ej. Reconocimiento vs Producción). Vacío = todas.",
  },
  tipMaxInterval: {
    en: "Only include cards with a review interval up to this many days. Cards with longer intervals are more mature. 0 = no limit.",
    es: "Solo incluir cartas con un intervalo de revisión de hasta estos días. Cartas con intervalos más largos son más maduras. 0 = sin límite.",
  },
  tipMinInterval: {
    en: "Only include cards with a review interval of at least this many days. Useful to skip brand-new cards. 0 = no limit.",
    es: "Solo incluir cartas con un intervalo de revisión de al menos estos días. Útil para saltear cartas nuevas. 0 = sin límite.",
  },
  tipReviewedDays: {
    en: "Only include cards you've reviewed within this many days. Great for practicing recently-seen words. 0 = no limit.",
    es: "Solo incluir cartas revisadas en los últimos días. Ideal para practicar palabras vistas recientemente. 0 = sin límite.",
  },
  tipWordCount: {
    en: "How many random words to pull from the matching cards.",
    es: "Cuántas palabras aleatorias sacar de las cartas que coincidan.",
  },

  // Onboarding
  getStarted: { en: "Get started", es: "Primeros pasos" },
  installAnkiConnect: { en: "Install AnkiConnect", es: "Instalar AnkiConnect" },
  required: { en: "required", es: "obligatorio" },
  optional: { en: "optional", es: "opcional" },
  installAnkiConnectDesc: {
    en: "Open Anki → Tools → Add-ons → Get Add-ons and paste code",
    es: "Abrí Anki → Herramientas → Complementos → Obtener complementos y pegá el código",
  },
  installAnkiConnectDesc2: {
    en: "Then Tools → Add-ons → AnkiConnect → Config and add",
    es: "Después Herramientas → Complementos → AnkiConnect → Config y agregá",
  },
  installAnkiConnectDesc3: {
    en: "to the config. Be sure to close and open Anki after these changes",
    es: "a la config. Asegurate de cerrar y abrir Anki después de estos cambios",
  },
  pickNoteType: { en: "Pick a note type", es: "Elegí un tipo de nota" },
  pickNoteTypeDesc: {
    en: "Select the Anki note type you want to practice with in the left panel.",
    es: "Seleccioná el tipo de nota de Anki con el que querés practicar en el panel izquierdo.",
  },
  mapFields: { en: "Map your fields", es: "Mapeá tus campos" },
  mapFieldsDesc: {
    en: "Tell the app which field contains the word, meaning, and furigana in the right panel.",
    es: "Indicale a la app qué campo contiene la palabra, significado y furigana en el panel derecho.",
  },
  setupFilters: { en: "Set up filters", es: "Configurar filtros" },
  setupFiltersDesc: {
    en: 'Narrow down cards by interval or review date, e.g. "4 words learnt in the last 5 days".',
    es: 'Filtrá cartas por intervalo o fecha de revisión, ej. "4 palabras aprendidas en los últimos 5 días".',
  },
  addApiKey: { en: "Add an LLM API key", es: "Agregar API key de LLM" },
  addApiKeyDesc: {
    en: "Get AI corrections on your sentences. Set this up in the right panel.",
    es: "Obtené correcciones de IA en tus oraciones. Configuralo en el panel derecho.",
  },
  getWordsStep: { en: "Get words!", es: "¡Obtené palabras!" },
  getWordsStepDesc: {
    en: "Hit the button in the left panel and start writing sentences.",
    es: "Presioná el botón en el panel izquierdo y empezá a escribir oraciones.",
  },

  // Mode toggle
  oneAtATime: { en: "One at a time", es: "De a una" },
  allInOne: { en: "All-in-one sentence", es: "Todo en una oración" },

  // Practice card
  writeSentence: {
    en: "Write a sentence using this word...",
    es: "Escribí una oración usando esta palabra...",
  },
  showHint: { en: "Show Hint", es: "Mostrar pista" },
  hideHint: { en: "Hide Hint", es: "Ocultar pista" },
  previous: { en: "← Previous", es: "← Anterior" },
  next: { en: "Next →", es: "Siguiente →" },

  // Challenge mode
  useAllWords: { en: "words", es: "palabras" },
  useAllWordsPre: { en: "Use", es: "Usá" },
  useAllWordsAll: { en: "all", es: "las" },
  useAllWordsPost: { en: "in one sentence", es: "en una oración" },
  clickToReveal: { en: "Click to reveal hint", es: "Click para ver pista" },
  writeSentenceAll: {
    en: "Write a sentence using all the words above...",
    es: "Escribí una oración usando todas las palabras de arriba...",
  },

  // Correction
  check: { en: "Check", es: "Verificar" },
  checking: { en: "Checking...", es: "Verificando..." },
  correctionHint: { en: "Hint for correction", es: "Pista para corrección" },
  correctionHintTip: {
    en: "Optional. Describe what you meant to say so the AI can correct the sentence better.",
    es: "Opcional. Explicá lo que querías decir para que la IA corrija mejor.",
  },
  correctionHintPlaceholder: {
    en: "Example: I wanted to say I went to the store yesterday.",
    es: "Ejemplo: Quería decir que fui a la tienda ayer.",
  },
  explainPromptTitle: {
    en: "Explain the correction (copy/paste prompt)",
    es: "Explicar la corrección (prompt para copiar)",
  },
  copyPrompt: { en: "Copy prompt", es: "Copiar prompt" },
  copied: { en: "Copied", es: "Copiado" },
  sendToLlm: { en: "Send to LLM", es: "Enviar a LLM" },
  clearInputs: { en: "Clear inputs", es: "Limpiar textos" },

  // Field mapping
  fieldMapping: { en: "Field mapping", es: "Mapeo de campos" },
  fieldMappingDesc: {
    en: "Map your note fields so the app knows which field is the word to practice, its meaning, and furigana. This is saved per note type.",
    es: "Mapeá los campos de tu nota para que la app sepa cuál es la palabra a practicar, su significado y furigana. Se guarda por tipo de nota.",
  },
  mainWord: { en: "Main word", es: "Palabra principal" },
  meaning: { en: "Meaning", es: "Significado" },
  furigana: { en: "Furigana", es: "Furigana" },
  selectField: { en: "Select field", es: "Seleccionar campo" },
  none: { en: "None", es: "Ninguno" },
  loadingFields: { en: "Loading fields...", es: "Cargando campos..." },
  history: { en: "History", es: "Historial" },
  refresh: { en: "Refresh", es: "Actualizar" },
  historyEmpty: {
    en: "No history yet. Run a check to see entries here.",
    es: "Todavía no hay historial. Hacé una corrección y lo vas a ver acá.",
  },

  // API settings
  sentenceChecker: { en: "Sentence checker", es: "Corrector de oraciones" },
  apiKeyHelperPre: {
    en: "Add an API key to get AI corrections on your sentences. Gemini is recommended — it's free up to 500 req/day.",
    es: "Agregá una API key para obtener correcciones de IA. Gemini es recomendado — es gratis hasta 500 req/día.",
  },
  getGeminiKey: { en: "Get a Gemini key here", es: "Obtené una key de Gemini acá" },
  apiKeyHelperPost: {
    en: "for best results.",
    es: "para mejores resultados.",
  },
  provider: { en: "Provider", es: "Proveedor" },
  model: { en: "Model", es: "Modelo" },
  apiKey: { en: "API Key", es: "API Key" },
  pasteApiKey: { en: "Paste your API key", es: "Pegá tu API key" },
  save: { en: "Save", es: "Guardar" },
  saved: { en: "Saved", es: "Guardado" },
  clear: { en: "Clear", es: "Borrar" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue>(null!);

const LANG_KEY = "anki-sentences-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "es" || stored === "en") return stored;
    return navigator.language.startsWith("es") ? "es" : "en";
  });

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  }

  function t(key: TranslationKey): string {
    return translations[key][lang];
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
