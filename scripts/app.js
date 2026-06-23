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

function prefixToDottedMask(prefix) {
  const bits = Number(String(prefix).replace("/", ""));

  if (!Number.isInteger(bits) || bits < 0 || bits > 32) {
    return "";
  }

  return Array.from({ length: 4 }, (_, index) => {
    const remainingBits = Math.min(8, Math.max(0, bits - index * 8));
    return remainingBits === 0 ? 0 : 256 - 2 ** (8 - remainingBits);
  }).join(".");
}

function renderMaskValue(mask) {
  const maskText = String(mask);

  if (!maskText.startsWith("/")) {
    return escapeHtml(maskText);
  }

  const dottedMask = prefixToDottedMask(maskText);
  return dottedMask
    ? `${escapeHtml(dottedMask)} <small>${escapeHtml(maskText)}</small>`
    : escapeHtml(maskText);
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

  const ideas = basics.ideas
    .map(
      (idea) => `
        <article class="core-idea">
          <span>${escapeHtml(idea.letter)}</span>
          <div>
            <h4>${escapeHtml(idea.title)}</h4>
            <strong data-reading>${escapeHtml(idea.short)}</strong>
            <p data-reading>${escapeHtml(idea.body)}</p>
          </div>
        </article>
      `,
    )
    .join("");
  const referenceCards = (basics.referenceCards || [])
    .map(
      (card) => `
        <article class="reference-card">
          <h4>${escapeHtml(card.title)}</h4>
          <p data-reading>${escapeHtml(card.body)}</p>
        </article>
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

  const method = basics.method
    .map(
      (step, index) => `
        <li>
          <span>${index + 1}</span>
          <div>
            <strong>${escapeHtml(step.title)}</strong>
            <p data-reading>${escapeHtml(step.body)}</p>
          </div>
        </li>
      `,
    )
    .join("");

  return `
    <section class="net-practice-course" aria-label="Cours débutant Net Practice">
      <header class="net-practice-intro">
        <p class="topic-kicker">Réseau expliqué simplement</p>
        <h2>${escapeHtml(basics.title)}</h2>
        <p data-reading>${escapeHtml(basics.intro)}</p>
        <p class="course-key" data-reading>${escapeHtml(basics.keySentence)}</p>
      </header>

      <section class="course-section" id="net-practice-five-ideas">
        <div class="course-heading">
          <span>01</span>
          <div>
            <p>Le minimum pour commencer</p>
            <h3>Les 5 idées indispensables</h3>
          </div>
        </div>
        <div class="core-ideas">${ideas}</div>
        ${
          referenceCards
            ? `
              <div class="reference-cards" aria-label="Repères NetPractice">
                ${referenceCards}
              </div>
            `
            : ""
        }
      </section>

      <section class="course-section mental-model">
        <div class="course-heading">
          <span>02</span>
          <div>
            <p>Une image à garder en tête</p>
            <h3>Le mini schéma mental</h3>
          </div>
        </div>
        <div class="mental-model-layout">
          <pre><code>${escapeHtml(basics.mentalDiagram)}</code></pre>
          <ol>${renderTextList(basics.mentalExplanation)}</ol>
        </div>
        <p class="remember-block" data-reading><strong>À retenir :</strong> le paquet doit pouvoir partir et la réponse doit pouvoir revenir.</p>
      </section>

      <section class="course-section route-reader">
        <div class="course-heading">
          <span>03</span>
          <div>
            <p>Lire un panneau de direction</p>
            <h3>Comprendre une route</h3>
          </div>
        </div>
        <pre class="route-expression"><code>${escapeHtml(basics.route.expression)}</code></pre>
        <div class="route-parts">
          <p data-reading>${escapeHtml(basics.route.destination)}</p>
          <p data-reading>${escapeHtml(basics.route.nextHop)}</p>
        </div>
        <div class="route-example">
          <strong>Exemple concret</strong>
          <pre><code>${escapeHtml(basics.route.example)}</code></pre>
          <p data-reading><strong>Traduction novice :</strong> ${escapeHtml(basics.route.translation)}</p>
        </div>
        <p class="mistake" data-reading><strong>Erreur fréquente :</strong> ${escapeHtml(basics.route.warning)}</p>
      </section>

      <section class="course-section mask-course">
        <div class="course-heading">
          <span>04</span>
          <div>
            <p>Pas besoin de souffrir avec le binaire</p>
            <h3>Comprendre le mask sans douleur</h3>
          </div>
        </div>
        <p data-reading>
          Le slash indique la taille du quartier. Plus le slash est grand, plus le quartier est petit.
        </p>
        <div class="table-scroll">
          <table>
            <thead>
              <tr><th>Préfixe</th><th>Mask</th><th>Adresses</th><th>Pas de calcul</th></tr>
            </thead>
            <tbody>${maskRows}</tbody>
          </table>
        </div>
        <div class="mask-tip">
          <p data-reading><strong>Astuce :</strong> ${escapeHtml(basics.maskTip.rule)}</p>
          <pre><code>${escapeHtml(basics.maskTip.example)}</code></pre>
        </div>
      </section>

      <section class="course-section guided-network-example">
        <div class="course-heading">
          <span>05</span>
          <div>
            <p>Tout déduire sans deviner</p>
            <h3>Un exemple concret très guidé</h3>
          </div>
        </div>
        <div class="given-values">
          <p><strong>IP</strong><span>${escapeHtml(basics.guidedExample.ip)}</span></p>
          <p><strong>Mask</strong><span>${escapeHtml(basics.guidedExample.mask)}</span></p>
        </div>
        <ol class="guided-steps">${renderTextList(basics.guidedExample.steps)}</ol>
        <div class="final-solution">
          <h4>Résultat</h4>
          <pre><code>${escapeHtml(basics.guidedExample.result)}</code></pre>
        </div>
      </section>

      <section class="course-section method-course">
        <div class="course-heading">
          <span>06</span>
          <div>
            <p>La même recette pour chaque niveau</p>
            <h3>La méthode NetPractice en 6 étapes</h3>
          </div>
        </div>
        <ol class="method-steps">${method}</ol>
      </section>

      <section class="course-section anti-panic">
        <div>
          <p class="topic-kicker">Plan de secours</p>
          <h3>Quand tu bloques, fais ça</h3>
          <ol>${renderTextList(basics.antiPanic)}</ol>
        </div>
        <div class="course-notes">
          ${basics.notes.map((note) => `<p data-reading>${escapeHtml(note)}</p>`).join("")}
        </div>
      </section>

      <details class="success-check">
        <summary>Ce que tu dois savoir expliquer après ce cours</summary>
        <ul>${renderTextList(basics.successQuestions)}</ul>
      </details>
    </section>
  `;
}

function renderNetPracticeAdvanced(topic, concepts, open = false) {
  return `
    <details class="technical-library"${open ? " open" : ""}>
      <summary>
        <span>Approfondissement technique</span>
        <small>Ancien cours complet, commandes et notions supplémentaires</small>
      </summary>
      <div class="technical-library-content">
        ${renderPreamble(topic.preamble)}
        <section class="overview" aria-label="Objectifs et notions">
          <div>
            <h3>Objectifs</h3>
            <ul>${renderTextList(topic.objectives)}</ul>
          </div>
          <div>
            <h3>Notions disponibles</h3>
            <ul>${topic.concepts.map((concept) => `<li>${escapeHtml(concept.title)}</li>`).join("")}</ul>
          </div>
        </section>
        ${concepts}
      </div>
    </details>
  `;
}

function renderNetworkNode(node, levelNumber) {
  const displayName = node.name || node.label;
  const details = (window.NET_PRACTICE_DIAGRAM_DETAILS || {})[levelNumber]?.[node.id];
  const interfaces = (details?.interfaces || [])
    .map(
      ([name, ip, mask]) => `
        <div class="network-interface-card">
          <p>interface ${escapeHtml(name)}</p>
          <div class="network-field">
            <span>IP</span>
            <code>${escapeHtml(ip)}</code>
          </div>
          <div class="network-field">
            <span>Mask</span>
            <code>${renderMaskValue(mask)}</code>
          </div>
        </div>
      `,
    )
    .join("");
  const routes = (details?.routes || [])
    .map(
      ([destination, nextHop]) => `
        <div class="network-route">
          <code>${escapeHtml(destination)}</code>
          <span aria-hidden="true">=&gt;</span>
          <code>${escapeHtml(nextHop)}</code>
        </div>
      `,
    )
    .join("");
  const networkData =
    interfaces || routes || details?.note
      ? `
        <div class="network-node-data">
          ${interfaces ? `<div class="network-interface-list">${interfaces}</div>` : ""}
          ${routes ? `<div class="network-route-list"><small>Routes</small>${routes}</div>` : ""}
          ${details?.note ? `<p>${escapeHtml(details.note)}</p>` : ""}
        </div>
      `
      : "";

  return `
    <div
      class="network-node network-node-${escapeHtml(node.type)}"
      style="left:${Number(node.x)}%; top:${Number(node.y)}%;"
      data-node-id="${escapeHtml(node.id)}"
      data-x="${Number(node.x)}"
      data-y="${Number(node.y)}"
      tabindex="0"
      role="button"
      aria-label="${escapeHtml(`${node.label}, ${displayName}. Déplaçable dans le schéma.`)}"
      title="Déplacer cet élément"
    >
      <img src="assets/net-${escapeHtml(node.type)}.svg" alt="">
      <small>${escapeHtml(node.label)}</small>
      <strong>${escapeHtml(displayName)}</strong>
      <span>${escapeHtml(node.detail)}</span>
      ${networkData}
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
              return `
                <line
                  data-from="${escapeHtml(link[0])}"
                  data-to="${escapeHtml(link[1])}"
                  x1="${Number(from.x)}"
                  y1="${Number(from.y)}"
                  x2="${Number(to.x)}"
                  y2="${Number(to.y)}"
                ></line>
              `;
            })
            .join("")}
        </svg>
        ${level.diagram.nodes.map((node) => renderNetworkNode(node, level.number)).join("")}
      </div>
    </div>
  `;
}

function setNetworkNodePosition(node, x, y) {
  const diagram = node.closest(".network-diagram");
  if (!diagram) {
    return;
  }

  const halfWidth = (node.offsetWidth / 2 / diagram.clientWidth) * 100;
  const halfHeight = (node.offsetHeight / 2 / diagram.clientHeight) * 100;
  const safeX = Math.min(99 - halfWidth, Math.max(1 + halfWidth, x));
  const safeY = Math.min(98 - halfHeight, Math.max(2 + halfHeight, y));

  node.dataset.x = String(safeX);
  node.dataset.y = String(safeY);
  node.style.left = `${safeX}%`;
  node.style.top = `${safeY}%`;
}

function updateNetworkCables(diagram) {
  const nodes = Object.fromEntries(
    [...diagram.querySelectorAll(".network-node")].map((node) => [node.dataset.nodeId, node]),
  );

  diagram.querySelectorAll(".network-cables line").forEach((line) => {
    const from = nodes[line.dataset.from];
    const to = nodes[line.dataset.to];

    if (!from || !to) {
      return;
    }

    line.setAttribute("x1", from.dataset.x);
    line.setAttribute("y1", from.dataset.y);
    line.setAttribute("x2", to.dataset.x);
    line.setAttribute("y2", to.dataset.y);
  });
}

function moveNetworkNodeByPixels(node, deltaX, deltaY) {
  const diagram = node.closest(".network-diagram");
  if (!diagram) {
    return;
  }

  setNetworkNodePosition(
    node,
    Number(node.dataset.x) + (deltaX / diagram.clientWidth) * 100,
    Number(node.dataset.y) + (deltaY / diagram.clientHeight) * 100,
  );
}

function resolveNetworkOverlaps(diagram) {
  const nodes = [...diagram.querySelectorAll(".network-node")];
  const gap = 12;

  for (let iteration = 0; iteration < 40; iteration += 1) {
    let collisionFound = false;

    for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < nodes.length; secondIndex += 1) {
        const first = nodes[firstIndex];
        const second = nodes[secondIndex];
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        const firstCenterX = firstRect.left + firstRect.width / 2;
        const firstCenterY = firstRect.top + firstRect.height / 2;
        const secondCenterX = secondRect.left + secondRect.width / 2;
        const secondCenterY = secondRect.top + secondRect.height / 2;
        const overlapX =
          (firstRect.width + secondRect.width) / 2 + gap - Math.abs(firstCenterX - secondCenterX);
        const overlapY =
          (firstRect.height + secondRect.height) / 2 + gap - Math.abs(firstCenterY - secondCenterY);

        if (overlapX <= 0 || overlapY <= 0) {
          continue;
        }

        collisionFound = true;

        if (overlapX < overlapY) {
          const direction = firstCenterX <= secondCenterX ? -1 : 1;
          moveNetworkNodeByPixels(first, direction * overlapX * 0.52, 0);
          moveNetworkNodeByPixels(second, -direction * overlapX * 0.52, 0);
        } else {
          const direction = firstCenterY <= secondCenterY ? -1 : 1;
          moveNetworkNodeByPixels(first, 0, direction * overlapY * 0.52);
          moveNetworkNodeByPixels(second, 0, -direction * overlapY * 0.52);
        }
      }
    }

    if (!collisionFound) {
      break;
    }
  }

  updateNetworkCables(diagram);
}

function initializeNetworkDiagrams() {
  document.querySelectorAll(".network-diagram").forEach((diagram) => {
    if (diagram.dataset.interactive === "true") {
      resolveNetworkOverlaps(diagram);
      return;
    }

    diagram.dataset.interactive = "true";
    const nodes = [...diagram.querySelectorAll(".network-node")];

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(() => resolveNetworkOverlaps(diagram));
      });
      resizeObserver.observe(diagram);
      diagram.networkResizeObserver = resizeObserver;
    }

    nodes.forEach((node) => {
      node.addEventListener("pointerdown", (event) => {
        if (event.button !== 0 && event.pointerType !== "touch") {
          return;
        }

        event.preventDefault();
        node.setPointerCapture(event.pointerId);
        node.classList.add("is-dragging");
        diagram.classList.add("is-dragging-node");

        const startX = event.clientX;
        const startY = event.clientY;
        const initialX = Number(node.dataset.x);
        const initialY = Number(node.dataset.y);

        const onMove = (moveEvent) => {
          const rect = diagram.getBoundingClientRect();
          setNetworkNodePosition(
            node,
            initialX + ((moveEvent.clientX - startX) / rect.width) * 100,
            initialY + ((moveEvent.clientY - startY) / rect.height) * 100,
          );
          updateNetworkCables(diagram);
        };

        const onEnd = () => {
          node.classList.remove("is-dragging");
          diagram.classList.remove("is-dragging-node");
          node.removeEventListener("pointermove", onMove);
          node.removeEventListener("pointerup", onEnd);
          node.removeEventListener("pointercancel", onEnd);
          resolveNetworkOverlaps(diagram);
        };

        node.addEventListener("pointermove", onMove);
        node.addEventListener("pointerup", onEnd);
        node.addEventListener("pointercancel", onEnd);
      });

      node.addEventListener("keydown", (event) => {
        const movement = event.shiftKey ? 24 : 8;
        const directions = {
          ArrowLeft: [-movement, 0],
          ArrowRight: [movement, 0],
          ArrowUp: [0, -movement],
          ArrowDown: [0, movement],
        };
        const direction = directions[event.key];

        if (!direction) {
          return;
        }

        event.preventDefault();
        moveNetworkNodeByPixels(node, direction[0], direction[1]);
        resolveNetworkOverlaps(diagram);
      });
    });

    resolveNetworkOverlaps(diagram);
  });
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
  const beginnerExplanations = Array.isArray(guide.beginnerFocus)
    ? guide.beginnerFocus
    : guide.beginnerFocus
      ? [guide.beginnerFocus]
      : [];
  const beginnerFocus = beginnerExplanations
    .map(
      (focus) => `
        <section class="beginner-focus">
          <p class="topic-kicker">Explication pure débutant</p>
          <h5>${escapeHtml(focus.title)}</h5>
          <p data-reading>${escapeHtml(focus.intro)}</p>
          <ol>${renderTextList(focus.steps)}</ol>
          <pre><code>${escapeHtml(focus.result)}</code></pre>
        </section>
      `,
    )
    .join("");

  return `
    <section class="concrete-walkthrough" aria-label="Résolution concrète du niveau ${escapeHtml(level.number)}">
      <header>
        <p>Correction guidée</p>
        <h4>Comprendre le niveau sans deviner</h4>
      </header>
      <div class="walkthrough-intro">
        <section>
          <h5>A. Ce que tu vois</h5>
          <ul>${renderTextList(guide.screen)}</ul>
        </section>
        <section>
          <h5>B. Ce que le niveau veut</h5>
          <p data-reading>${escapeHtml(guide.goal)}</p>
        </section>
      </div>
      <section class="networks-block">
        <h5>C. Les réseaux à créer</h5>
        <ul>${renderTextList(guide.networks)}</ul>
      </section>
      <section class="deductions">
        <h5>D. Résolution pas à pas</h5>
        <div class="level-rules">
          <strong>Règles utiles pour ce niveau</strong>
          <ul>${renderTextList(guide.rules)}</ul>
        </div>
        ${deductions}
      </section>
      ${beginnerFocus}
      <section class="final-solution">
        <h5>E. Solution finale de l’exemple</h5>
        <pre><code>${escapeHtml(guide.solution)}</code></pre>
        <p data-reading>
          Ces valeurs servent à comprendre la méthode. Si ton niveau affiche d’autres nombres, conserve le même raisonnement et recalcule les blocs.
        </p>
      </section>
      <section class="packet-journey">
        <h5>F. Trajet du paquet : pourquoi cela marche</h5>
        <ol>${renderTextList(guide.packet)}</ol>
      </section>
      <section class="frequent-errors">
        <h5>G. Pièges fréquents</h5>
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
    <section id="net-practice-levels-guide" class="level-guide" aria-label="Guide des dix niveaux Net Practice">
      <header class="level-guide-header">
        <p class="topic-kicker">Analyse des exercices</p>
        <h2>Les 10 niveaux, expliqués pas à pas</h2>
        <p data-reading>
          Chaque niveau commence par un exemple chiffré complet. Une fois le raisonnement compris, la partie technique montre comment l’adapter aux valeurs générées dans ton propre exercice.
        </p>
        <p class="diagram-naming-note" data-reading>
          Dans les schémas, <strong>host A</strong> désigne la machine, <strong>A1</strong> son interface réseau et le nom comme <strong>webserv.non-real.com</strong> permet de la reconnaître à l’écran.
        </p>
        <p class="generated-values-note" data-reading>
          <strong>Mode training :</strong> la forme du niveau reste la même. Les IP sont générées à partir du login, donc un même login retrouve les mêmes valeurs pour un même niveau. Avec un autre login, les nombres changent mais le raisonnement reste identique. En évaluation, les niveaux 6 à 10 et leurs valeurs sont tirés de manière variable.
        </p>
        <p class="diagram-values-note" data-reading>
          Les IP affichées dans les box correspondent à l’exemple corrigé du site. Ton login peut afficher d’autres nombres : les blocs et la méthode de calcul restent les mêmes.
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
              <details class="level-technical-details">
                <summary>Approfondir le corrigé technique</summary>
                <div class="level-columns">
                  <section>
                    <h4>Notions techniques</h4>
                    <ul>${renderTextList(level.principle)}</ul>
                  </section>
                  <section>
                    <h4>Méthode générale</h4>
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
                    <h4>Pièges techniques</h4>
                    <ul>${renderTextList(level.traps)}</ul>
                  </section>
                </div>
                ${renderDetailedExplanation(level)}
              </details>
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

      const levelShortcut =
        topic.id === "net-practice"
          ? `
            <button
              class="nav-subsection"
              type="button"
              data-topic-id="net-practice"
              data-scroll-target="net-practice-levels-guide"
            >
              <span aria-hidden="true">↓</span>
              <strong>Les 10 niveaux, expliqués pas à pas</strong>
            </button>
            <button
              class="nav-subsection"
              type="button"
              data-topic-id="net-practice"
              data-page-url="net-practice-visual.html"
            >
              <span aria-hidden="true">↗</span>
              <strong>Les 10 niveaux, expliqués autrement</strong>
            </button>
          `
          : "";

      return `
        <div class="nav-group">
          <button type="button" data-topic-id="${escapeHtml(topic.id)}"${current}>
            <span class="nav-number">${escapeHtml(topic.number)}</span>
            <span class="nav-copy">
              <strong>${escapeHtml(topic.shortTitle || topic.title)}</strong>
              <span>${escapeHtml(topic.focus)}</span>
            </span>
          </button>
          ${levelShortcut}
        </div>
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

  if (topic.id === "net-practice") {
    elements.panel.innerHTML = `
      <article class="topic-card net-practice-page">
        ${renderNetPracticeBasics(topic.id)}
        ${renderNetPracticeLevels(topic.id)}
        ${renderNetPracticeAdvanced(topic, concepts, Boolean(conceptSlug))}
      </article>
    `;
  } else {
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
            <ul>${renderTextList(topic.objectives)}</ul>
          </div>
          <div>
            <h3>Notions</h3>
            <ul>${topic.concepts.map((concept) => `<li>${escapeHtml(concept.title)}</li>`).join("")}</ul>
          </div>
        </section>
        ${concepts}
      </article>
    `;
  }

  window.readingAssist.refresh(document);
  requestAnimationFrame(() => {
    requestAnimationFrame(initializeNetworkDiagrams);
  });

  document.fonts?.ready.then(initializeNetworkDiagrams);

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

  if (button.dataset.pageUrl) {
    window.location.href = button.dataset.pageUrl;
    return;
  }

  renderTopic(button.dataset.topicId);

  if (button.dataset.scrollTarget) {
    document
      .getElementById(button.dataset.scrollTarget)
      ?.scrollIntoView({ block: "start", behavior: "instant" });
  }
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
