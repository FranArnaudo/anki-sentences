# Anki Sentences 📚✨

Create focused sentence practice from your Anki cards. Filter by deck, note type, card type, interval, and recent reviews, then practice one-at-a-time or in a challenge mode. Includes optional LLM sentence generation for extra context.

## Features ✅

- Connects to Anki via AnkiConnect
- Filter by deck, note type, card type, interval, and recent ratings
- Practice modes: single-card flow or all-in-one challenge
- Field mapping per note type
- Optional LLM sentence generation
- Bilingual UI (EN/ES)

## Requirements 🧩

- Anki + AnkiConnect add-on (ID `2055492159`)
- AnkiConnect CORS: add `http://localhost:5173` to `webCorsOriginList`

## GitHub Pages + AnkiConnect (Chrome Extension) 🧩

To connect from GitHub Pages (HTTPS) you need the small bridge extension in this repo. It forwards requests from the web app to local AnkiConnect.

1. Open Chrome → `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `extension` folder in this repo
4. Make sure Anki is running with AnkiConnect
5. Open the site: `https://franarnaudo.github.io/anki-sentences/`

## Quick Start 🚀

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

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
