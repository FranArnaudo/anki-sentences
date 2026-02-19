# Anki Sentences 📚✨

## Choose your language for the ReadMe / Elige idioma para el Léeme

Current: **English** | [Español](README_ES.md)

Create focused sentence practice from your Anki cards. Filter by deck, note type, card type, interval, and recent reviews, then practice one-at-a-time or in a challenge mode. Includes optional LLM sentence generation for extra context.

## Features ✅

- Connects to Anki via AnkiConnect
- Filter by deck, note type, card type, interval, and recent ratings
- Practice modes: single-card flow or all-in-one challenge
- Field mapping per note type
- Optional LLM sentence generation
- Bilingual UI (EN/ES)

## Requirements 🧩

- Anki Desktop installed
- Anki + AnkiConnect add-on (ID `2055492159`)
- Anki → Tools → Add-ons → AnkiConnect → Config → Paste this and then close and reopen Anki:

```json
{
  "apiKey": null,
  "apiLogPath": null,
  "ignoreOriginList": [],
  "webBindAddress": "127.0.0.1",
  "webBindPort": 8765,
  "webCorsOriginList": [
    "http://localhost",
    "http://localhost:5173",
    "https://franarnaudo.github.io"
  ]
}
```

<img width="325" height="181" alt="image" src="https://github.com/user-attachments/assets/6a44f027-6b21-4f10-bf56-621997f7f8d8" />
You will have to enable permissions to connect to local devices (this is needed to connect to your anki locally)

## Get a Gemini API Key 🔑

1. Open Google AI Studio and sign in:

```
https://ai.google.dev/aistudio
```

2. Open the API Keys page:

```
https://aistudio.google.com/app/apikey
```

3. Click **Create API key** (choose a project if asked).
4. Copy the key and paste it into the API key field in the app.

More info from Google:

```
https://ai.google.dev/gemini-api/docs/api-key
```

## Live Page 🌐

`https://franarnaudo.github.io/anki-sentences/`

## Usage 🧭

1. Install AnkiConnect and configure CORS.
2. Pick a note type.
3. Map your fields (word, meaning, sentence, etc.).
4. (Optional) Set filters and add an API key.
5. Generate and practice.

## API Key Notes 🔐

There is a dedicated field in the app where you can paste your LLM API key.
This has only been tested with Gemini's free tier. It has not been tested with Claude or ChatGPT.

### Important Warning ⚠️

Be careful about where you paste API keys. This project is open source, so you can inspect the code to verify it only sends the key to fetch responses and doesn't do anything else.

## GitHub Pages (Free Hosting) 🌐

This repo ships with a GitHub Actions workflow to deploy the Vite build to GitHub Pages.

1. Ensure GitHub Pages is set to use **GitHub Actions**: `Settings → Pages → Source`.
2. Push to `main`. The workflow builds and deploys the `dist` folder.

Your site will be available at:
`https://franarnaudo.github.io/anki-sentences/`

## Tech Stack ⚙️

- React 19 + TypeScript
- Vite

## License 📄

MIT
