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

function renderNetPracticeBasics(topicId) {
  const basics = window.NET_PRACTICE_BASICS;

  if (topicId !== "net-practice" || !basics) {
    return "";
  }

  const lessons = basics.lessons
    .map(
      (lesson) => `
        <section class="basics-lesson">
          <div class="basics-lesson-title">
            <span>${escapeHtml(lesson.letter)}</span>
            <h4>${escapeHtml(lesson.title)}</h4>
          </div>
          <div class="pedagogy-pair">
            <div class="pedagogy-block novice-block">
              <strong>Version novice</strong>
              <p data-reading>${escapeHtml(lesson.novice)}</p>
            </div>
            <div class="pedagogy-block technical-block">
              <strong>Version technique</strong>
              <p data-reading>${escapeHtml(lesson.technical)}</p>
            </div>
          </div>
          <div class="concrete-example">
            <strong>Exemple concret</strong>
            <pre><code>${escapeHtml(lesson.example)}</code></pre>
          </div>
          <p class="remember-block" data-reading><strong>À retenir :</strong> ${escapeHtml(lesson.remember)}</p>
        </section>
      `,
    )
    .join("");

  const maskRows = basics.masks
    .map(
      (row) => `
        <tr>
          ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
        </tr>
      `,
    )
    .join("");

  const questions = basics.questions
    .map(
      (item) => `
        <details class="basics-question">
          <summary>${escapeHtml(item.title)}</summary>
          <p data-reading>${escapeHtml(item.answer)}</p>
        </details>
      `,
    )
    .join("");

  return `
    <section class="net-practice-basics" aria-label="Bases indispensables avant Net Practice">
      <header>
        <p class="preamble-kicker">Point de départ</p>
        <h3>${escapeHtml(basics.title)}</h3>
        <p data-reading>${escapeHtml(basics.intro)}</p>
      </header>
      ${lessons}
      <section class="mask-reference">
        <h4>Table de calcul rapide</h4>
        <p data-reading>
          Le nombre d’adresses inclut l’adresse réseau et le broadcast. Pour les masques ci-dessous, le pas s’applique au dernier octet.
        </p>
        <div class="table-scroll">
          <table>
            <thead>
              <tr><th>Préfixe</th><th>Masque</th><th>Adresses</th><th>Hôtes</th><th>Départs des blocs</th></tr>
            </thead>
            <tbody>${maskRows}</tbody>
          </table>
        </div>
      </section>
      <section class="basics-faq">
        <h4>Questions à se poser</h4>
        ${questions}
      </section>
    </section>
  `;
}

function renderNetworkNode(node) {
  return `
    <div
      class="network-node network-node-${escapeHtml(node.type)}"
      style="left:${Number(node.x)}%; top:${Number(node.y)}%;"
    >
      <img src="assets/net-${escapeHtml(node.type)}.svg" alt="">
      <strong>${escapeHtml(node.label)}</strong>
      <span>${escapeHtml(node.detail)}</span>
    </div>
  `;
}

function renderNetworkDiagram(level) {
  if (!level.diagram) {
    return "";
  }

  const nodesById = Object.fromEntries(level.diagram.nodes.map((node) => [node.id, node]));

  return `
    <div class="network-diagram-scroll">
      <div
        class="network-diagram"
        style="--diagram-ratio:${escapeHtml(level.diagram.ratio || "16 / 9")};"
        aria-label="Schéma simplifié du niveau ${escapeHtml(level.number)}"
      >
        <svg class="network-cables" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${level.diagram.links
            .map((link) => {
              const from = nodesById[link[0]];
              const to = nodesById[link[1]];
              return `<line x1="${Number(from.x)}" y1="${Number(from.y)}" x2="${Number(to.x)}" y2="${Number(to.y)}"></line>`;
            })
            .join("")}
        </svg>
        ${level.diagram.nodes.map(renderNetworkNode).join("")}
      </div>
    </div>
  `;
}

function renderDetailedExplanation(level) {
  const explanation = (window.NET_PRACTICE_EXPLANATIONS || {})[level.number];

  if (!explanation) {
    return "";
  }

  const calculationSteps = explanation.calculations
    .map(
      (step, index) => `
        <section class="calculation-step">
          <span>${index + 1}</span>
          <div>
            <h5>${escapeHtml(step.title)}</h5>
            ${step.body.map((line) => `<p data-reading>${escapeHtml(line)}</p>`).join("")}
            ${step.code ? `<pre><code>${escapeHtml(step.code)}</code></pre>` : ""}
          </div>
        </section>
      `,
    )
    .join("");

  return `
    <section class="level-deep-dive" aria-label="Explication détaillée du niveau ${escapeHtml(level.number)}">
      <header>
        <p>Corrigé raisonné</p>
        <h4>${escapeHtml(explanation.title)}</h4>
        ${explanation.intro.map((line) => `<p data-reading>${escapeHtml(line)}</p>`).join("")}
      </header>
      <section class="observation-panel">
        <h4>1. Ce qu’il faut relever avant de calculer</h4>
        <ul>${renderTextList(explanation.observations)}</ul>
      </section>
      <section class="calculation-panel">
        <h4>2. Version technique : généraliser le calcul</h4>
        ${calculationSteps}
      </section>
      <section class="packet-panel">
        <h4>3. Suivre le paquet pour prouver que cela fonctionne</h4>
        ${explanation.packet.map((line) => `<p data-reading>${escapeHtml(line)}</p>`).join("")}
        <pre><code>${escapeHtml(explanation.packetTrace)}</code></pre>
      </section>
      <section class="verification-panel">
        <h4>4. Vérification avant le check</h4>
        <ol>${renderTextList(explanation.verification)}</ol>
      </section>
    </section>
  `;
}

function renderConcreteWalkthrough(level) {
  const guide = (window.NET_PRACTICE_CONCRETE || {})[level.number];

  if (!guide) {
    return "";
  }

  const deductions = guide.deductions
    .map(
      (step, index) => `
        <section class="deduction-step">
          <span class="deduction-number">${index + 1}</span>
          <div class="deduction-content">
            <p data-reading><strong>Ce que je regarde :</strong> ${escapeHtml(step.look)}</p>
            <p data-reading><strong>Ce que cela signifie :</strong> ${escapeHtml(step.meaning)}</p>
            <p data-reading><strong>Comment je l’ai déduite :</strong> ${escapeHtml(step.deduction)}</p>
            <p class="deduced-value" data-reading><strong>Valeur choisie :</strong> ${escapeHtml(step.value)}</p>
            <p data-reading><strong>Pourquoi cette IP ou cette route :</strong> ${escapeHtml(step.why)}</p>
          </div>
        </section>
      `,
    )
    .join("");

  return `
    <section class="concrete-walkthrough" aria-label="Résolution concrète du niveau ${escapeHtml(level.number)}">
      <header>
        <p>Version novice</p>
        <h4>Résoudre ce niveau sans deviner</h4>
      </header>
      <div class="walkthrough-intro">
        <section>
          <h5>1. Ce que tu vois à l’écran</h5>
          <ul>${renderTextList(guide.screen)}</ul>
        </section>
        <section>
          <h5>2. Ce que le niveau veut vérifier</h5>
          <p data-reading>${escapeHtml(guide.goal)}</p>
        </section>
      </div>
      <section class="rules-block">
        <h5>3. Règles utiles</h5>
        <ul>${renderTextList(guide.rules)}</ul>
      </section>
      <section class="deductions">
        <h5>4. Résolution pas à pas</h5>
        ${deductions}
      </section>
      <section class="final-solution">
        <h5>5. Solution finale de l’exemple</h5>
        <pre><code>${escapeHtml(guide.solution)}</code></pre>
        <p data-reading>
          Ces valeurs servent à comprendre la méthode. Si ton niveau affiche d’autres nombres, conserve le même raisonnement et recalcule les blocs.
        </p>
      </section>
      <section class="packet-journey">
        <h5>6. Trajet du paquet : pourquoi cela marche</h5>
        <ol>${renderTextList(guide.packet)}</ol>
      </section>
      <section class="frequent-errors">
        <h5>7. Erreurs fréquentes</h5>
        <ul>${renderTextList(guide.traps)}</ul>
      </section>
    </section>
  `;
}

function renderNetPracticeLevels(topicId) {
  const levels = window.NET_PRACTICE_LEVELS || [];

  if (topicId !== "net-practice" || levels.length === 0) {
    return "";
  }

  return `
    <section class="level-guide" aria-label="Guide des dix niveaux Net Practice">
      <header class="level-guide-header">
        <p class="topic-kicker">Analyse des exercices</p>
        <h2>Les 10 niveaux, expliqués pas à pas</h2>
        <p data-reading>
          Chaque niveau commence par un exemple chiffré complet. Une fois le raisonnement compris, la partie technique montre comment l’adapter aux valeurs générées dans ton propre exercice.
        </p>
      </header>
      ${levels
        .map(
          (level) => `
            <article class="level-card" id="net-practice-level-${escapeHtml(level.number)}">
              <div class="level-title">
                <span>${escapeHtml(level.number)}</span>
                <div>
                  <p>${escapeHtml(level.focus)}</p>
                  <h3>${escapeHtml(level.title)}</h3>
                </div>
              </div>
              ${renderNetworkDiagram(level)}
              ${renderConcreteWalkthrough(level)}
              <div class="level-columns">
                <section>
                  <h4>Version technique : notions</h4>
                  <ul>${renderTextList(level.principle)}</ul>
                </section>
                <section>
                  <h4>Méthode de résolution</h4>
                  <ol>${renderTextList(level.method)}</ol>
                </section>
              </div>
              <h4>Exemple transposable</h4>
              <pre><code>${escapeHtml(level.example)}</code></pre>
              <div class="level-columns">
                <section class="level-success">
                  <h4>Pourquoi cela fonctionne</h4>
                  <ul>${renderTextList(level.why)}</ul>
                </section>
                <section class="level-traps">
                  <h4>Pièges du niveau</h4>
                  <ul>${renderTextList(level.traps)}</ul>
                </section>
              </div>
              ${renderDetailedExplanation(level)}
            </article>
          `,
        )
        .join("")}
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
      ${renderNetPracticeBasics(topic.id)}
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
      ${renderNetPracticeLevels(topic.id)}
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
