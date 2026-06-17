const state = {
  topics: window.SYSADMIN_TOPICS || [],
  activeId: "",
};

const elements = {
  nav: document.querySelector("#topic-nav"),
  panel: document.querySelector("#topic-panel"),
  searchInput: document.querySelector("#search-input"),
  clearSearch: document.querySelector("#clear-search"),
  readingToggle: document.querySelector("#reading-toggle"),
  resultsPanel: document.querySelector("#results-panel"),
  resultsList: document.querySelector("#results-list"),
  resultsCount: document.querySelector("#results-count"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "";
  }

  return `
    <ul class="tag-list" aria-label="Tags">
      ${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}
    </ul>
  `;
}

function renderTextList(lines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return "";
  }

  return lines.map((line) => `<li data-reading>${escapeHtml(line)}</li>`).join("");
}

function renderPreamble(preamble) {
  if (!preamble || !Array.isArray(preamble.sections) || preamble.sections.length === 0) {
    return "";
  }

  const intro = Array.isArray(preamble.intro)
    ? preamble.intro.map((line) => `<p data-reading>${escapeHtml(line)}</p>`).join("")
    : "";

  const sections = preamble.sections
    .map((section) => {
      const body = Array.isArray(section.body)
        ? section.body.map((line) => `<p data-reading>${escapeHtml(line)}</p>`).join("")
        : "";
      const code = section.code
        ? `<pre><code>${escapeHtml(section.code)}</code></pre>`
        : "";
      const warning = section.warning
        ? `<p class="mistake" data-reading>${escapeHtml(section.warning)}</p>`
        : "";
      const tip = section.tip
        ? `<p class="tip" data-reading>${escapeHtml(section.tip)}</p>`
        : "";

      return `
        <section class="preamble-section">
          <h4>${escapeHtml(section.title)}</h4>
          ${body}
          ${code}
          ${warning}
          ${tip}
        </section>
      `;
    })
    .join("");

  return `
    <section class="preamble" aria-label="Préambule théorique">
      <p class="preamble-kicker">Cours théorique</p>
      <h3>${escapeHtml(preamble.title)}</h3>
      ${intro}
      ${sections}
    </section>
  `;
}

function renderNav() {
  elements.nav.innerHTML = state.topics
    .map((topic) => {
      const current = topic.id === state.activeId ? ' aria-current="page"' : "";

      return `
        <button type="button" data-topic-id="${escapeHtml(topic.id)}"${current}>
          <span class="nav-number">${escapeHtml(topic.number)}</span>
          <span class="nav-copy">
            <strong>${escapeHtml(topic.shortTitle || topic.title)}</strong>
            <span>${escapeHtml(topic.focus)}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderTopic(topicId, conceptSlug = "") {
  const topic = state.topics.find((item) => item.id === topicId) || state.topics[0];

  if (!topic) {
    elements.panel.innerHTML = '<p class="empty-state">Aucun sujet à afficher.</p>';
    return;
  }

  state.activeId = topic.id;
  renderNav();

  const concepts = topic.concepts
    .map((concept) => {
      const id = `${topic.id}-${slugify(concept.title)}`;
      const code = concept.code
        ? `<h4>Commande ou exemple</h4><pre><code>${escapeHtml(concept.code)}</code></pre>`
        : "";

      return `
        <article class="concept" id="${escapeHtml(id)}">
          <div class="concept-heading">
            <h3>${escapeHtml(concept.title)}</h3>
          </div>
          ${renderTags(concept.tags)}
          ${concept.body.map((line) => `<p data-reading>${escapeHtml(line)}</p>`).join("")}
          ${code}
          <h4>Erreur fréquente</h4>
          <p class="mistake" data-reading>${escapeHtml(concept.mistake)}</p>
          <h4>Bon réflexe</h4>
          <p class="tip" data-reading>${escapeHtml(concept.tip)}</p>
        </article>
      `;
    })
    .join("");

  elements.panel.innerHTML = `
    <article class="topic-card">
      <p class="topic-kicker">${escapeHtml(topic.focus)}</p>
      <h2>${escapeHtml(topic.title)}</h2>
      <p class="summary" data-reading>${escapeHtml(topic.summary)}</p>
      <ul class="meta-list" aria-label="Métadonnées">
        <li>${escapeHtml(topic.status)}</li>
        <li>${topic.concepts.length} notions</li>
        <li>${escapeHtml(topic.focus)}</li>
      </ul>
      ${renderPreamble(topic.preamble)}
      <section class="overview" aria-label="Objectifs et notions">
        <div>
          <h3>Objectifs</h3>
          <ul>
            ${renderTextList(topic.objectives)}
          </ul>
        </div>
        <div>
          <h3>Notions</h3>
          <ul>
            ${topic.concepts.map((concept) => `<li>${escapeHtml(concept.title)}</li>`).join("")}
          </ul>
        </div>
      </section>
      ${concepts}
    </article>
  `;

  window.readingAssist.refresh(document);

  if (conceptSlug) {
    document.getElementById(conceptSlug)?.scrollIntoView({ block: "start" });
  } else {
    elements.panel.scrollIntoView({ block: "start" });
  }
}

function getSearchText(topic, concept) {
  return [
    topic.title,
    topic.shortTitle,
    topic.focus,
    topic.summary,
    concept.title,
    ...(concept.tags || []),
    ...(concept.body || []),
    concept.code || "",
    concept.mistake || "",
    concept.tip || "",
  ]
    .join(" ")
    .toLowerCase();
}

function search(query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    elements.resultsPanel.hidden = true;
    return;
  }

  const results = [];

  state.topics.forEach((topic) => {
    topic.concepts.forEach((concept) => {
      if (getSearchText(topic, concept).includes(normalized)) {
        results.push({ topic, concept });
      }
    });
  });

  elements.resultsPanel.hidden = false;
  elements.resultsCount.textContent = `${results.length} résultat${results.length > 1 ? "s" : ""}`;

  if (results.length === 0) {
    elements.resultsList.innerHTML = '<li class="empty-state" data-reading>Aucun résultat. Essaie un mot plus court.</li>';
    window.readingAssist.refresh(document);
    return;
  }

  elements.resultsList.innerHTML = results
    .map(({ topic, concept }) => {
      const targetId = `${topic.id}-${slugify(concept.title)}`;
      const excerpt = concept.body[0] || topic.summary;

      return `
        <li>
          <button class="result-button" type="button" data-topic-id="${escapeHtml(topic.id)}" data-concept-id="${escapeHtml(targetId)}">
            <strong>${escapeHtml(concept.title)}</strong>
            <span data-reading>${escapeHtml(topic.title)} - ${escapeHtml(excerpt)}</span>
          </button>
        </li>
      `;
    })
    .join("");

  window.readingAssist.refresh(document);
}

elements.nav.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-topic-id]");
  if (!button) {
    return;
  }

  renderTopic(button.dataset.topicId);
});

elements.searchInput.addEventListener("input", (event) => {
  search(event.target.value);
});

elements.clearSearch.addEventListener("click", () => {
  elements.searchInput.value = "";
  elements.resultsPanel.hidden = true;
  elements.searchInput.focus();
});

elements.readingToggle.addEventListener("click", () => {
  const enabled = elements.readingToggle.getAttribute("aria-pressed") !== "true";
  elements.readingToggle.setAttribute("aria-pressed", String(enabled));
  window.readingAssist.setEnabled(enabled, document);
});

elements.resultsList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-topic-id]");
  if (!button) {
    return;
  }

  renderTopic(button.dataset.topicId, button.dataset.conceptId);
});

renderTopic(state.topics[0]?.id || "");

const readingEnabled = window.readingAssist.isEnabled();
elements.readingToggle.setAttribute("aria-pressed", String(readingEnabled));
window.readingAssist.setEnabled(readingEnabled, document);
