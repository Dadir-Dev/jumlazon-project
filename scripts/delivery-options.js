// Small utility: add business days (skips Sat/Sun)
function addBusinessDays(date, days) {
  const result = new Date(date);
  while (days > 0) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) days--;
  }
  return result;
}

// Format a date like "Tuesday, Dec 12"
function formatNiceDate(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Update displayed delivery date based on selected option
function updateDeliveryDisplay() {
  const checked = document.querySelector('input[name="delivery"]:checked');
  const displayEl = document.querySelector("[data-delivery-date]");
  if (!checked || !displayEl) return;

  const minDays = parseInt(checked.dataset.minDays, 10) || 0;
  const maxDays = parseInt(checked.dataset.maxDays, 10) || minDays;
  const now = new Date();

  const earliest = addBusinessDays(now, minDays);
  const latest = addBusinessDays(now, maxDays);

  const earliestText = formatNiceDate(earliest);
  const latestText = formatNiceDate(latest);

  // Show a range when min !== max, otherwise show single date
  const text =
    minDays === maxDays ? earliestText : `${earliestText} — ${latestText}`;

  displayEl.textContent = text;
  displayEl.setAttribute("datetime", earliest.toISOString().split("T")[0]);
}

// Hook listeners
document.querySelectorAll('input[name="delivery"]').forEach((el) => {
  el.addEventListener("change", updateDeliveryDisplay);
});

// Initial population
updateDeliveryDisplay();
