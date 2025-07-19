// src/data.js
export async function fetchGates() {
  return [
    {
      id: "A1",
      type: "Arrival",
      time: new Date("2025-07-18T14:30:00"),
      startTime: new Date("2025-07-18T14:20:00"),
      guard: "Anders",
      screen: "12",
    },
    // … flere gates
  ];
}

/**
 * Simulerer real-time opdateringer ved at kalde callback med ny data
 * hvert 5. sekund
 * @param {(gates: Array<object>) => void} cb
 * @returns {number} interval-ID til clearInterval()
 */
export function onGatesChanged(cb) {
  // Kald callback med initial data øjeblikkeligt
  fetchGates().then(cb);
  // Så hver 5 sekunder
  const id = setInterval(async () => {
    cb(await fetchGates());
  }, 5000);
  return id;
}
