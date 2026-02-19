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

## Scripts 🛠️
```bash
npm run dev      # start dev server
npm run build    # type-check + build
npm run preview  # preview production build
npm run lint     # lint
```

## Tech Stack ⚙️
- React 19 + TypeScript
- Vite

## License 📄
MIT
