(function () {
  const STORAGE_KEY = "sysAndNetAdminReadingAssist";
  const WORD_PATTERN = /[\p{L}\p{M}\p{N}]+(?:['\u2019][\p{L}\p{M}\p{N}]+)?/gu;

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function splitWord(word) {
    const chars = Array.from(word);

    if (chars.length <= 1) {
      return escapeHtml(word);
    }

    const prefixLength = chars.length <= 3 ? 1 : Math.ceil(chars.length * 0.45);
    const prefix = escapeHtml(chars.slice(0, prefixLength).join(""));
    const rest = escapeHtml(chars.slice(prefixLength).join(""));

    return `<span class="assist-word"><strong>${prefix}</strong>${rest}</span>`;
  }

  function transformText(text) {
    let html = "";
    let lastIndex = 0;

    for (const match of text.matchAll(WORD_PATTERN)) {
      html += escapeHtml(text.slice(lastIndex, match.index));
      html += splitWord(match[0]);
      lastIndex = match.index + match[0].length;
    }

    html += escapeHtml(text.slice(lastIndex));
    return html;
  }

  function enable(root) {
    root.querySelectorAll("[data-reading]").forEach((element) => {
      if (element.closest("pre, code")) {
        return;
      }

      if (!element.dataset.originalText) {
        element.dataset.originalText = element.textContent;
      }

      element.innerHTML = transformText(element.dataset.originalText);
    });
  }

  function disable(root) {
    root.querySelectorAll("[data-reading]").forEach((element) => {
      if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
      }
    });
  }

  function isEnabled() {
    return localStorage.getItem(STORAGE_KEY) === "on";
  }

  function setEnabled(enabled, root) {
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");

    if (enabled) {
      enable(root);
    } else {
      disable(root);
    }
  }

  window.readingAssist = {
    isEnabled,
    setEnabled,
    refresh(root) {
      if (isEnabled()) {
        enable(root);
      }
    },
  };
})();
