import { formatTime, calcStartsIn } from "./utils.js"; // vi laver dem i næste trin

/**
 * Vis en liste af gates som fuldbredde-rækker med alle felter
 * @param {Array<{id:string,type:string,time:Date,startTime:Date,guard:string,screen:string}>} gates
 */
export function renderMonitoringList(gates) {
  const container = document.getElementById("gate-list");
  if (!container) return;

  container.innerHTML = gates
    .map(
      (g) => `
      <div class="monitor-row">
        <span class="mr-cell gate">${g.id}</span>
        <span class="mr-cell type">${g.type}</span>
        <span class="mr-cell time">${formatTime(g.time)}</span>
        <span class="mr-cell starts-in">${calcStartsIn(g.startTime)}</span>
        <span class="mr-cell guard">${g.guard}</span>
        <span class="mr-cell screen">Skærm ${g.screen}</span>
      </div>
    `,
    )
    .join("");
}

// src/ui.js

/**
 * Tegner faner i <div id="tabs">
 * @param {string[]} tabs
 * @param {string} activeTab
 * @param {(tab: string) => void} onTabChange
 */
export function renderTabs(tabs, activeTab, onTabChange) {
  const container = document.getElementById("tabs");
  if (!container) return;

  container.innerHTML = tabs
    .map((name) => {
      const cls = name === activeTab ? "tab active" : "tab";
      return `<div class="${cls}" data-tab="${name}">${name}</div>`;
    })
    .join("");

  // Bind klik-events
  container.querySelectorAll(".tab").forEach((el) =>
    el.addEventListener("click", () => {
      const sel = el.getAttribute("data-tab");
      if (sel && sel !== activeTab) {
        onTabChange(sel);
      }
    }),
  );
}

// src/ui.js

// ————— Hjælpefunktioner til menuen —————

/** Fjerner overlay + menu hvis de findes */
function removeGateMenu() {
  const ov = document.querySelector(".gate-menu-overlay");
  const m = document.querySelector(".gate-menu");
  if (ov) ov.remove();
  if (m) m.remove();
}

/**
 * Håndter klik på menu-punkter
 * @param {string} gateId
 * @param {string} action
 */
function handleGateAction(gateId, action) {
  console.log(`Action "${action}" valgt for gate ${gateId}`);
  // TODO: sæt status i databasen, åben detaljer, etc.
}

/**
 * Viser menu på position ud for det klik­kede element
 * @param {string} gateId
 * @param {HTMLElement} btn     – det klik­kede gate-ikon
 */
function showGateMenu(gateId, btn) {
  removeGateMenu(); // fjern evt. gammel menu

  // 1) Opret overlay
  const overlay = document.createElement("div");
  overlay.className = "gate-menu-overlay show";
  overlay.addEventListener("click", removeGateMenu);

  // 2) Opret selve menu-boksen
  const menu = document.createElement("div");
  menu.className = "gate-menu";
  menu.innerHTML = `
    <button data-action="activate">Aktivér gate</button>
    <button data-action="change-time">Ændrere tidspunkt</button>
    <button data-action="change-gate">Ændrere gate</button>
    <button data-action="set-departure">Sæt til Departure</button>
    <button data-action="remove">Fjern flight</button>
  `;
  // Håndter klik på menu-knapper
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
    const act = e.target.getAttribute("data-action");
    if (act) {
      handleGateAction(gateId, act);
      removeGateMenu();
    }
  });

  // 3) Tilføj overlay og menu til dokumentet
  document.body.appendChild(overlay);
  document.body.appendChild(menu);

  // 4) Beregn position lige under og til venstre for knappen
  const rect = btn.getBoundingClientRect();
  const top = rect.bottom + window.scrollY + 4; // 4px afstand
  const left = rect.left + window.scrollX;
  menu.style.top = `${top}px`;
  menu.style.left = `${left}px`;

  // 5) Trigger CSS-anim: på næste frame sæt .show
  requestAnimationFrame(() => {
    menu.classList.add("show");
  });
}

/** Binder klik-event til alle .gate-icon elementer */
export function attachGateMenu() {
  // Fjern gamle listeners ved hver rendering
  document.querySelectorAll(".gate-icon").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const gateId = btn.textContent.trim();
      showGateMenu(gateId, btn);
    };
  });
}

// Luk menu hvis brugeren klikker et andet sted
document.addEventListener("click", removeGateMenu);

// Hjælpefunktion til at formatere minutter:sekunder
function formatDuration(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Tegner overvågnings-listen med rækker farve-kodet efter status
 * @param {Array<{id: string, status: string, type?:string, scheduledTime?:string, startedAt?:string, guard?:string, screen?:string}>} gates
 */
export function renderMonitoringList(gates) {
  const container = document.getElementById("gate-list");
  if (!container) return;

  // 1) Bestem rækkefølge på status (kan justeres efter behov)
  const order = ["ACTIVE", "PENDING", "UNASSIGNED", "DONE"];
  gates.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

  // 2) Byg HTML for hver gate
  container.innerHTML = gates
    .map((g) => {
      const duration = g.startedAt
        ? formatDuration(Date.now() - new Date(g.startedAt))
        : "";
      return `
      <div class="monitor-row status-${g.status}">
        <div class="mr-cell gate">${g.id}</div>
        <div class="mr-cell type">${g.type || ""}</div>
        <div class="mr-cell time">${g.scheduledTime || ""}</div>
        <div class="mr-cell starts-in">${duration}</div>
        <div class="mr-cell guard">${g.guard || ""}</div>
        <div class="mr-cell screen">${g.screen || ""}</div>
        <button class="menu-button">⋮</button>
      </div>
    `;
    })
    .join("");

  export function renderGateList(gates) {
    const container = document.getElementById("gate-list");
    if (!container) return;

    container.innerHTML = gates
      .map(
        (g) => `<button class="gate-icon status-${g.status}">${g.id}</button>`,
      )
      .join("");

    // Her bindes menu-knappen til hver gate-ikon
    attachGateMenu();
  }

  // 3) Bind drop-down til hver menu-knap
  document.querySelectorAll(".menu-button").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const row = btn.closest(".monitor-row");
      const gateId = row.querySelector(".mr-cell.gate").textContent.trim();
      showGateMenu(gateId, btn);
    };
  });
}
