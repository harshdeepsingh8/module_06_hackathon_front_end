// DOM helpers
const $ = (sel) => document.querySelector(sel);

// Elements
const DOM = {
  quoteText: $('#quote-text'),
  quoteAuthor: $('#quote-author'),
  fetchBtn: $('#fetch-quote'),
  autoToggleBtn: $('#auto-toggle'),
  stopAutoBtn: $('#stop-auto'),
  status: $('#status'),
  intervalInput: $('#interval-ms'),
  themeButtons: document.querySelectorAll('.theme-btn')
};

// Config
const API_URL = "https://api.quotable.io/random";
const DEFAULT_INTERVAL_MS = 8000;
const FETCH_TIMEOUT_MS = 7000;

// State
let autoTimer = null;
let isAuto = false;
let cache = new Map();
let currentAbort = null;

// Status display
function setStatus(msg, isError = false) {
  DOM.status.textContent = msg;
  DOM.status.style.color = isError ? "crimson" : "";
}

// Render quote
function renderQuote({ content, author }) {
  DOM.quoteText.textContent = content;
  DOM.quoteAuthor.textContent = author ? `— ${author}` : "— Unknown";
}

// Fetch with timeout and abort
async function fetchWithTimeout(url) {
  if (currentAbort) currentAbort.abort();

  const controller = new AbortController();
  currentAbort = controller;

  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// Fetch quote
async function getQuote() {
  setStatus("Loading...");
  try {
    const data = await fetchWithTimeout(API_URL);

    cache.set(data._id, data);
    renderQuote({ content: data.content, author: data.author });

    setStatus("Loaded ✓");
  } catch (err) {
    setStatus("Error: " + err.message, true);

    if (cache.size > 0) {
      const first = cache.values().next().value;
      renderQuote(first);
      setStatus("Showing cached quote");
    }
  }
}

// Auto mode
function getIntervalMs() {
  const val = Number(DOM.intervalInput.value);
  return val >= 1000 ? val : DEFAULT_INTERVAL_MS;
}

function startAuto() {
  if (isAuto) return;
  isAuto = true;

  const interval = getIntervalMs();
  setStatus(`Auto mode running every ${interval / 1000}s`);

  getQuote();
  autoTimer = setInterval(getQuote, interval);
  updateAutoButtons();
}

function stopAuto() {
  isAuto = false;
  clearInterval(autoTimer);
  autoTimer = null;

  setStatus("Auto stopped");
  updateAutoButtons();
}

function toggleAuto() {
  isAuto ? stopAuto() : startAuto();
}

function updateAutoButtons() {
  DOM.autoToggleBtn.textContent = isAuto ? "Pause Auto" : "Start Auto";
  DOM.stopAutoBtn.disabled = !isAuto;
}

// Theme switching
DOM.themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.getAttribute("data-theme");
    document.body.setAttribute("data-theme", theme);
  });
});

// Event listeners
DOM.fetchBtn.addEventListener("click", getQuote);
DOM.autoToggleBtn.addEventListener("click", toggleAuto);
DOM.stopAutoBtn.addEventListener("click", stopAuto);

// Init
getQuote();
updateAutoButtons();
