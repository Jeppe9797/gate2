// src/app.js
import { fetchGates, onGatesChanged } from "./data.js";
import { renderGateList } from "./ui.js";
import { renderTabs } from "./ui.js";

const TAB_NAMES = ["Overvågning", "Gates"];
let currentTab = TAB_NAMES[0];

function updateView(tab) {
  currentTab = tab;
  // Tegn faner med korrekt aktiv markering
  renderTabs(TAB_NAMES, currentTab, updateView);

  // Hent data og rendér indhold baseret på valgt tab
  fetchGates().then((gates) => {
    if (currentTab === "Overvågning") {
      // Eksempel: vis kun ACTIVE og PENDING
      const filtered = gates.filter((g) =>
        ["ACTIVE", "PENDING"].includes(g.status),
      );
      renderGateList(filtered);
    } else {
      // Vis alle gates
      renderGateList(gates);
    }
  });
}

// Initialiser app
console.log("GateMonitor app loaded!");
updateView(currentTab);

// Realtids-opdateringer genkalder altid med aktuel fane
onGatesChanged(() => updateView(currentTab));
