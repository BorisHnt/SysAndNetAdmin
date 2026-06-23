const levels = window.NET_PRACTICE_LEVELS || [];
const detailsByLevel = window.NET_PRACTICE_DIAGRAM_DETAILS || {};
const visualsByLevel = window.NET_PRACTICE_VISUALS || {};
const subnetColors = [
  "var(--subnet-1)",
  "var(--subnet-2)",
  "var(--subnet-3)",
  "var(--subnet-4)",
  "var(--subnet-5)",
];

const elements = {
  tabs: document.querySelector("#level-tabs"),
  focus: document.querySelector("#level-focus"),
  title: document.querySelector("#level-title"),
  summary: document.querySelector("#level-summary"),
  map: document.querySelector("#network-map"),
  subnetList: document.querySelector("#subnet-list"),
  explanation: document.querySelector("#subnet-explanation"),
  reset: document.querySelector("#reset-layout"),
  showAll: document.querySelector("#show-all-subnets"),
};

const state = {
  levelNumber: getInitialLevel(),
  activeSubnetId: "",
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getInitialLevel() {
  const hash = window.location.hash.replace("#", "");
  return levels.some((level) => level.number === hash) ? hash : levels[0]?.number || "01";
}

function getCurrentLevel() {
  return levels.find((level) => level.number === state.levelNumber);
}

function getCurrentVisual() {
  return visualsByLevel[state.levelNumber];
}

function getSubnetColor(index) {
  return subnetColors[index % subnetColors.length];
}

function findSubnetForInterface(interfaceName) {
  const visual = getCurrentVisual();
  const index = visual.subnets.findIndex((subnet) =>
    subnet.interfaces.some(([name]) => name === interfaceName),
  );
  return index >= 0 ? getSubnetColor(index) : "var(--line-strong)";
}

function renderTabs() {
  elements.tabs.innerHTML = levels
    .map(
      (level) => `
        <button
          class="level-tab"
          type="button"
          role="tab"
          aria-selected="${level.number === state.levelNumber}"
          data-level="${escapeHtml(level.number)}"
        >${escapeHtml(level.number)}</button>
      `,
    )
    .join("");
}

function renderNode(node) {
  const details = detailsByLevel[state.levelNumber]?.[node.id] || {};
  const interfaces = (details.interfaces || [])
    .map(
      ([name, ip, mask]) => `
        <div class="visual-interface">
          <b style="--subnet-color:${findSubnetForInterface(name)}">
            <span class="subnet-dot"></span>${escapeHtml(name)}
          </b>
          <span>${escapeHtml(ip)}</span>
          <span>${escapeHtml(mask)}</span>
        </div>
      `,
    )
    .join("");
  const routes = (details.routes || [])
    .map(
      ([destination, nextHop]) => `
        <div class="visual-route">
          <span>${escapeHtml(destination)}</span>
          <span>→</span>
          <span>${escapeHtml(nextHop)}</span>
        </div>
      `,
    )
    .join("");
  const memberships = getCurrentVisual().subnets
    .filter((subnet) => subnet.nodes.includes(node.id))
    .map((subnet) => subnet.id)
    .join(" ");

  return `
    <div
      class="visual-node"
      data-node-id="${escapeHtml(node.id)}"
      data-subnets="${escapeHtml(memberships)}"
      data-x="${Number(node.x)}"
      data-y="${Number(node.y)}"
      style="left:${Number(node.x)}%;top:${Number(node.y)}%;"
      tabindex="0"
      aria-label="${escapeHtml(`${node.label}, ${node.name || node.label}. Déplaçable.`)}"
    >
      <img src="assets/net-${escapeHtml(node.type)}.svg" alt="">
      <small>${escapeHtml(node.label)}</small>
      <strong>${escapeHtml(node.name || node.label)}</strong>
      <span>${escapeHtml(node.detail)}</span>
      <div class="visual-node-data">
        ${interfaces}
        ${routes ? `<span class="visual-route-label">Routes</span>${routes}` : ""}
        ${details.note ? `<span>${escapeHtml(details.note)}</span>` : ""}
      </div>
    </div>
  `;
}

function renderMap() {
  const level = getCurrentLevel();
  const visual = getCurrentVisual();
  const links = visual.subnets.flatMap((subnet, subnetIndex) =>
    subnet.links.map(([from, to], linkIndex) => ({
      from,
      to,
      subnet,
      subnetIndex,
      linkIndex,
    })),
  );

  elements.map.innerHTML = `
    <svg class="subnet-areas" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${visual.subnets
        .map(
          (subnet, index) => `
            <rect
              class="subnet-area"
              data-subnet-id="${escapeHtml(subnet.id)}"
              fill="${getSubnetColor(index)}"
              stroke="${getSubnetColor(index)}"
            ></rect>
          `,
        )
        .join("")}
    </svg>
    <svg class="visual-cables" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${links
        .map(
          ({ from, to, subnet, subnetIndex }) => `
            <line
              class="visual-link-band"
              data-subnet-id="${escapeHtml(subnet.id)}"
              data-from="${escapeHtml(from)}"
              data-to="${escapeHtml(to)}"
              stroke="${getSubnetColor(subnetIndex)}"
            ></line>
            <line
              class="visual-link"
              data-subnet-id="${escapeHtml(subnet.id)}"
              data-from="${escapeHtml(from)}"
              data-to="${escapeHtml(to)}"
              stroke="${getSubnetColor(subnetIndex)}"
            ></line>
          `,
        )
        .join("")}
    </svg>
    ${visual.subnets
      .map(
        (subnet, index) => `
          <span
            class="subnet-label"
            data-subnet-id="${escapeHtml(subnet.id)}"
            style="color:${getSubnetColor(index)}"
          >${escapeHtml(subnet.cidr)}</span>
        `,
      )
      .join("")}
    ${level.diagram.nodes.map(renderNode).join("")}
  `;

  initializeMap();
}

function renderSubnetList() {
  const visual = getCurrentVisual();
  elements.subnetList.innerHTML = visual.subnets
    .map(
      (subnet, index) => `
        <button
          class="subnet-button"
          type="button"
          data-subnet-id="${escapeHtml(subnet.id)}"
          aria-pressed="${subnet.id === state.activeSubnetId}"
          style="--subnet-color:${getSubnetColor(index)}"
        >
          <span></span>
          <span>
            <strong>${escapeHtml(subnet.label)}</strong>
            <small>${escapeHtml(subnet.cidr)}</small>
          </span>
        </button>
      `,
    )
    .join("");
}

function highlightCommonPart(address, common) {
  const [ip, mask = ""] = address.split("/");
  if (!ip.startsWith(common)) {
    return escapeHtml(address);
  }

  return `<span class="common-part">${escapeHtml(common)}</span>${escapeHtml(ip.slice(common.length))}${mask ? `/${escapeHtml(mask)}` : ""}`;
}

function renderExplanation() {
  const visual = getCurrentVisual();
  if (!state.activeSubnetId) {
    renderOverviewExplanation();
    return;
  }

  const subnet = visual.subnets.find((item) => item.id === state.activeSubnetId);
  const index = visual.subnets.indexOf(subnet);
  const color = getSubnetColor(index);

  elements.explanation.style.setProperty("--subnet-color", color);
  elements.explanation.innerHTML = `
    <div>
      <p class="visual-eyebrow">Sous-réseau sélectionné</p>
      <h2>${escapeHtml(subnet.label)}</h2>
      <div class="explanation-code">
        <h3>${escapeHtml(subnet.cidr)}</h3>
        <p>${escapeHtml(subnet.why)}</p>
      </div>
      <div class="network-facts">
        <p><strong>Adresses utilisables</strong><br>${escapeHtml(subnet.range)}</p>
        <p><strong>Adresses interdites</strong><br>${escapeHtml(subnet.forbidden)}</p>
      </div>
    </div>
    <div>
      <p class="visual-eyebrow">Ce que les IP ont en commun</p>
      <h3>Compare les interfaces</h3>
      <div class="interface-comparison">
        ${subnet.interfaces
          .map(
            ([name, address]) => `
              <div class="comparison-row">
                <strong>${escapeHtml(name)}</strong>
                <code>${highlightCommonPart(address, subnet.common)}</code>
              </div>
            `,
          )
          .join("")}
      </div>
      <p>
        La partie colorée est commune dans cet exemple. Le mask indique précisément combien de bits appartiennent au réseau ; la couleur sert ici de repère visuel, pas de remplacement au calcul.
      </p>
    </div>
  `;
}

function renderOverviewExplanation() {
  const visual = getCurrentVisual();
  elements.explanation.style.removeProperty("--subnet-color");
  elements.explanation.innerHTML = `
    <div>
      <p class="visual-eyebrow">Vue complète</p>
      <h2>Tous les quartiers sont visibles</h2>
      <p>
        Chaque couleur représente un sous-réseau distinct. Deux interfaces placées sur la même couleur doivent partager le réseau indiqué par le label.
      </p>
    </div>
    <div>
      <p class="visual-eyebrow">Pour lire le schéma</p>
      <h3>Sélectionne une couleur</h3>
      <p>
        Le reste du plan sera atténué. Tu verras alors les IP du quartier, leur partie commune, les adresses utilisables et la raison du mask.
      </p>
      <div class="network-facts">
        <p><strong>${visual.subnets.length} sous-réseau${visual.subnets.length > 1 ? "x" : ""}</strong><br>dans ce niveau</p>
        <p><strong>Équipements déplaçables</strong><br>les câbles restent connectés</p>
      </div>
    </div>
  `;
}

function setNodePosition(node, x, y) {
  const mapRect = elements.map.getBoundingClientRect();
  const halfWidth = (node.offsetWidth / 2 / mapRect.width) * 100;
  const halfHeight = (node.offsetHeight / 2 / mapRect.height) * 100;
  const safeX = Math.min(99 - halfWidth, Math.max(1 + halfWidth, x));
  const safeY = Math.min(98 - halfHeight, Math.max(2 + halfHeight, y));

  node.dataset.x = String(safeX);
  node.dataset.y = String(safeY);
  node.style.left = `${safeX}%`;
  node.style.top = `${safeY}%`;
}

function moveNodeByPixels(node, deltaX, deltaY) {
  const rect = elements.map.getBoundingClientRect();
  setNodePosition(
    node,
    Number(node.dataset.x) + (deltaX / rect.width) * 100,
    Number(node.dataset.y) + (deltaY / rect.height) * 100,
  );
}

function getNodesById() {
  return Object.fromEntries(
    [...elements.map.querySelectorAll(".visual-node")].map((node) => [node.dataset.nodeId, node]),
  );
}

function updateGraphics() {
  const nodes = getNodesById();

  elements.map.querySelectorAll(".visual-link, .visual-link-band").forEach((line) => {
    const from = nodes[line.dataset.from];
    const to = nodes[line.dataset.to];
    if (!from || !to) return;
    line.setAttribute("x1", from.dataset.x);
    line.setAttribute("y1", from.dataset.y);
    line.setAttribute("x2", to.dataset.x);
    line.setAttribute("y2", to.dataset.y);
  });

  getCurrentVisual().subnets.forEach((subnet) => {
    const memberNodes = subnet.nodes.map((id) => nodes[id]).filter(Boolean);
    const mapRect = elements.map.getBoundingClientRect();
    const boxes = memberNodes.map((node) => node.getBoundingClientRect());
    const padding = 14;
    const left = Math.max(mapRect.left, Math.min(...boxes.map((box) => box.left)) - padding);
    const right = Math.min(mapRect.right, Math.max(...boxes.map((box) => box.right)) + padding);
    const top = Math.max(mapRect.top, Math.min(...boxes.map((box) => box.top)) - padding);
    const bottom = Math.min(mapRect.bottom, Math.max(...boxes.map((box) => box.bottom)) + padding);
    const area = elements.map.querySelector(`.subnet-area[data-subnet-id="${subnet.id}"]`);

    area.setAttribute("x", ((left - mapRect.left) / mapRect.width) * 100);
    area.setAttribute("y", ((top - mapRect.top) / mapRect.height) * 100);
    area.setAttribute("width", ((right - left) / mapRect.width) * 100);
    area.setAttribute("height", ((bottom - top) / mapRect.height) * 100);

    const [fromId, toId] = subnet.links[0];
    const from = nodes[fromId];
    const to = nodes[toId];
    const label = elements.map.querySelector(`.subnet-label[data-subnet-id="${subnet.id}"]`);
    label.style.left = `${(Number(from.dataset.x) + Number(to.dataset.x)) / 2}%`;
    label.style.top = `${(Number(from.dataset.y) + Number(to.dataset.y)) / 2}%`;
  });
}

function resolveOverlaps() {
  const nodes = [...elements.map.querySelectorAll(".visual-node")];
  const gap = 14;

  for (let iteration = 0; iteration < 45; iteration += 1) {
    let found = false;

    for (let a = 0; a < nodes.length; a += 1) {
      for (let b = a + 1; b < nodes.length; b += 1) {
        const first = nodes[a];
        const second = nodes[b];
        const one = first.getBoundingClientRect();
        const two = second.getBoundingClientRect();
        const centerOneX = one.left + one.width / 2;
        const centerOneY = one.top + one.height / 2;
        const centerTwoX = two.left + two.width / 2;
        const centerTwoY = two.top + two.height / 2;
        const overlapX = (one.width + two.width) / 2 + gap - Math.abs(centerOneX - centerTwoX);
        const overlapY = (one.height + two.height) / 2 + gap - Math.abs(centerOneY - centerTwoY);

        if (overlapX <= 0 || overlapY <= 0) continue;
        found = true;

        if (overlapX < overlapY) {
          const direction = centerOneX <= centerTwoX ? -1 : 1;
          moveNodeByPixels(first, direction * overlapX * 0.52, 0);
          moveNodeByPixels(second, -direction * overlapX * 0.52, 0);
        } else {
          const direction = centerOneY <= centerTwoY ? -1 : 1;
          moveNodeByPixels(first, 0, direction * overlapY * 0.52);
          moveNodeByPixels(second, 0, -direction * overlapY * 0.52);
        }
      }
    }

    if (!found) break;
  }

  updateGraphics();
}

function initializeMap() {
  elements.map.querySelectorAll(".visual-node").forEach((node) => {
    node.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 && event.pointerType !== "touch") return;
      event.preventDefault();
      node.setPointerCapture(event.pointerId);
      node.classList.add("is-dragging");

      const startX = event.clientX;
      const startY = event.clientY;
      const initialX = Number(node.dataset.x);
      const initialY = Number(node.dataset.y);

      const onMove = (moveEvent) => {
        const rect = elements.map.getBoundingClientRect();
        setNodePosition(
          node,
          initialX + ((moveEvent.clientX - startX) / rect.width) * 100,
          initialY + ((moveEvent.clientY - startY) / rect.height) * 100,
        );
        updateGraphics();
      };

      const onEnd = () => {
        node.classList.remove("is-dragging");
        node.removeEventListener("pointermove", onMove);
        node.removeEventListener("pointerup", onEnd);
        node.removeEventListener("pointercancel", onEnd);
        resolveOverlaps();
      };

      node.addEventListener("pointermove", onMove);
      node.addEventListener("pointerup", onEnd);
      node.addEventListener("pointercancel", onEnd);
    });

    node.addEventListener("keydown", (event) => {
      const amount = event.shiftKey ? 24 : 8;
      const directions = {
        ArrowLeft: [-amount, 0],
        ArrowRight: [amount, 0],
        ArrowUp: [0, -amount],
        ArrowDown: [0, amount],
      };
      if (!directions[event.key]) return;
      event.preventDefault();
      moveNodeByPixels(node, directions[event.key][0], directions[event.key][1]);
      resolveOverlaps();
    });
  });

  requestAnimationFrame(() => requestAnimationFrame(resolveOverlaps));
}

function applySubnetFilter() {
  const activeId = state.activeSubnetId;

  elements.map.querySelectorAll(".visual-node").forEach((node) => {
    const memberships = node.dataset.subnets.split(" ");
    node.classList.toggle("is-dimmed", Boolean(activeId) && !memberships.includes(activeId));
  });

  elements.map
    .querySelectorAll(".visual-link, .visual-link-band, .subnet-area, .subnet-label")
    .forEach((item) => {
      item.classList.toggle("is-dimmed", Boolean(activeId) && item.dataset.subnetId !== activeId);
    });
}

function selectSubnet(subnetId) {
  state.activeSubnetId = subnetId;
  renderSubnetList();
  renderExplanation();
  applySubnetFilter();
}

function renderLevel() {
  const level = getCurrentLevel();
  const visual = getCurrentVisual();
  if (!level || !visual) return;

  state.activeSubnetId = "";
  window.location.hash = level.number;
  elements.focus.textContent = `Niveau ${level.number} · ${level.focus}`;
  elements.title.textContent = level.title;
  elements.summary.textContent = visual.summary;
  renderTabs();
  renderMap();
  renderSubnetList();
  renderExplanation();
  applySubnetFilter();
}

elements.tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-level]");
  if (!button) return;
  state.levelNumber = button.dataset.level;
  renderLevel();
});

elements.subnetList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-subnet-id]");
  if (!button) return;
  selectSubnet(button.dataset.subnetId);
});

elements.showAll.addEventListener("click", () => {
  state.activeSubnetId = "";
  renderSubnetList();
  applySubnetFilter();
  renderOverviewExplanation();
});

elements.reset.addEventListener("click", renderLevel);
window.addEventListener("resize", () => requestAnimationFrame(resolveOverlaps));

renderLevel();
