/*
Async Quote Generator — script.js
Features:
- Manual fetch of inspirational quotes
- Auto mode (interval)
- Stop auto mode
- Simple in-memory cache
- Abort controller + timeout
- Error handling and UI updates


Also included below (in comments) are 5 staged git commits with exact commands you can run locally.
*/


// -------------------------
// DOM helpers & selectors
// -------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));


// Expected DOM structure (minimal):
// - #quote-text (for quote)
// - #quote-author (for author)
// - #fetch-quote (button)
// - #auto-toggle (button)
// - #stop-auto (button)
// - #status (small status text)
// - optional: <input id="interval-ms"> for auto interval


const DOM = {
quoteText: $('#quote-text'),
quoteAuthor: $('#quote-author'),
fetchBtn: $('#fetch-quote'),
autoToggleBtn: $('#auto-toggle'),
stopAutoBtn: $('#stop-auto'),
status: $('#status'),
intervalInput: $('#interval-ms')
};