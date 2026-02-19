window.addEventListener("message", (event) => {
  if (event.source !== window) {
    return;
  }

  const message = event.data;
  if (!message || message.type !== "ANKI_CONNECT_REQUEST") {
    return;
  }

  chrome.runtime.sendMessage(
    { type: "ANKI_CONNECT_REQUEST", payload: message },
    (response) => {
      const error = chrome.runtime.lastError
        ? chrome.runtime.lastError.message
        : response?.error ?? null;

      window.postMessage(
        {
          type: "ANKI_CONNECT_RESPONSE",
          id: message.id,
          result: response?.result ?? null,
          error
        },
        "*"
      );
    }
  );
});
