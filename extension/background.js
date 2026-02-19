const ANKI_CONNECT_URL = "http://localhost:8765";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "ANKI_CONNECT_REQUEST") {
    return;
  }

  const { action, params, version } = message.payload || {};

  fetch(ANKI_CONNECT_URL, {
    method: "POST",
    body: JSON.stringify({ action, version, params })
  })
    .then((response) => response.json())
    .then((data) => {
      sendResponse({ result: data.result ?? null, error: data.error ?? null });
    })
    .catch((error) => {
      sendResponse({ result: null, error: error.message || "Request failed" });
    });

  return true;
});
