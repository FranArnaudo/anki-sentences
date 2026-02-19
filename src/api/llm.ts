export type Provider = "openai" | "gemini" | "claude";

export const MODELS: Record<Provider, string[]> = {
  openai: ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1-nano"],
  gemini: ["gemini-2.5-flash", "gemini-2.5-pro"],
  claude: ["claude-haiku-4-5-20251001", "claude-sonnet-4-5-20250929"],
};

export interface LLMConfig {
  provider: Provider;
  apiKey: string;
  model: string;
}

const STORAGE_KEY = "anki-sentences-llm";

export function saveConfig(config: LLMConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function loadConfig(): LLMConfig | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

function buildPrompt(
  word: string,
  sentence: string,
  lang: string,
  hint?: string
): string {
  const translationLang = lang === "es" ? "Spanish" : "English";
  const intent =
    hint && hint.trim()
      ? `\nThe student intended meaning (summary): ${hint.trim()}\n`
      : "\n";
  return `You are a Japanese language tutor. The student was given the word 「${word}」 and wrote this sentence:
「${sentence}」
${intent}

If the sentence has errors, reply ONLY with:
Line 1: The corrected sentence using these markers:
  - 【corrected text】 for text that was changed (wrong word/conjugation/particle)
  - 〈added text〉 for text that was missing and needs to be inserted
  - ｛removed text｝ for text that should be deleted
Line 2: ${translationLang} translation

If the sentence is correct, reply ONLY with:
✓
${translationLang} translation

Be very brief. No explanations.`;
}

async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callClaude(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model,
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Claude error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text;
}

export async function checkSentence(
  word: string,
  sentence: string,
  lang: string = "en",
  hint?: string
): Promise<string> {
  const result = await checkSentenceWithMeta(word, sentence, lang, hint);
  return result.text;
}

export interface LLMResult {
  text: string;
  provider: Provider;
  model: string;
}

export async function checkSentenceWithMeta(
  word: string,
  sentence: string,
  lang: string = "en",
  hint?: string
): Promise<LLMResult> {
  const config = loadConfig();
  if (!config || !config.apiKey) {
    throw new Error("No API key configured");
  }

  const prompt = buildPrompt(word, sentence, lang, hint);

  const model = config.model || MODELS[config.provider][0];

  switch (config.provider) {
    case "openai":
      return {
        text: await callOpenAI(config.apiKey, model, prompt),
        provider: config.provider,
        model,
      };
    case "gemini":
      return {
        text: await callGemini(config.apiKey, model, prompt),
        provider: config.provider,
        model,
      };
    case "claude":
      return {
        text: await callClaude(config.apiKey, model, prompt),
        provider: config.provider,
        model,
      };
  }
}

export async function runCustomPrompt(prompt: string): Promise<LLMResult> {
  const config = loadConfig();
  if (!config || !config.apiKey) {
    throw new Error("No API key configured");
  }

  const model = config.model || MODELS[config.provider][0];

  switch (config.provider) {
    case "openai":
      return {
        text: await callOpenAI(config.apiKey, model, prompt),
        provider: config.provider,
        model,
      };
    case "gemini":
      return {
        text: await callGemini(config.apiKey, model, prompt),
        provider: config.provider,
        model,
      };
    case "claude":
      return {
        text: await callClaude(config.apiKey, model, prompt),
        provider: config.provider,
        model,
      };
  }
}
