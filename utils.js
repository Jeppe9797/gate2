// src/utils.js

/** Formaterer JS Date til “HH:MM” dansk stil */
export function formatTime(date) {
  return date.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Beregn hvor mange minutter til startTime, eller “Starter nu” */
export function calcStartsIn(startTime) {
  const now = new Date();
  const diffMin = Math.round((startTime - now) / 60000);
  return diffMin > 0 ? `Starter om ${diffMin} min` : "Starter nu";
}
