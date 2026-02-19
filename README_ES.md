# Anki Sentences 📚✨

> **Choose Language / Elige idioma:** [English](README.md) | **Español**

Crea práctica enfocada de oraciones desde tus tarjetas de Anki. Filtra por mazo, tipo de nota, tipo de tarjeta, intervalo y repasos recientes; luego practica una por una o en modo desafío. Incluye generación opcional de oraciones con LLM para más contexto.

## Funciones ✅

- Se conecta a Anki mediante AnkiConnect
- Filtra por mazo, tipo de nota, tipo de tarjeta, intervalo y valoraciones recientes
- Modos de práctica: una tarjeta a la vez o desafío todo‑en‑uno
- Mapeo de campos por tipo de nota
- Generación opcional de oraciones con LLM
- Interfaz bilingüe (EN/ES)

## Requisitos 🧩

- Tener instalado Anki Desktop
- Anki + complemento AnkiConnect (ID `2055492159`)
- Anki → Tools → Add-ons → AnkiConnect → Config → Pega esto y luego cierra y vuelve a abrir Anki:
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
Tendrás que habilitar permisos para conectar con dispositivos locales (esto es necesario para conectar con tu Anki local).

## Inicio rápido 🚀

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Uso 🧭

1. Instala AnkiConnect y configura CORS.
2. Elige un tipo de nota.
3. Mapea tus campos (palabra, significado, oración, etc.).
4. (Opcional) Configura filtros y agrega una API key.
5. Genera y practica.

## Notas sobre la API Key 🔐

Hay un campo dedicado en la app donde puedes pegar tu API key del LLM.
Esto solo se ha probado con el plan gratuito de Gemini. No se ha probado con Claude ni ChatGPT.

### Advertencia importante ⚠️

Ten cuidado con dónde pegas tus API keys. Este proyecto es open source, así que puedes revisar el código para verificar que solo se usa para obtener respuestas y nada más.

## GitHub Pages (Hosting gratis) 🌐

Este repo incluye un workflow de GitHub Actions para desplegar el build de Vite en GitHub Pages.

1. Asegúrate de que GitHub Pages esté en **GitHub Actions**: `Settings → Pages → Source`.
2. Haz push a `main`. El workflow compila y despliega la carpeta `dist`.

Tu sitio estará disponible en:
`https://franarnaudo.github.io/anki-sentences/`

## Stack ⚙️

- React 19 + TypeScript
- Vite

## Licencia 📄

MIT
