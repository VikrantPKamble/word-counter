// script.js

// DOM elements
const textarea = document.getElementById('text-input');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');

const wordsEl = document.getElementById('words-value');
const charsEl = document.getElementById('chars-value');
const sentencesEl = document.getElementById('sentences-value');
const paragraphsEl = document.getElementById('paragraphs-value');
const readingEl = document.getElementById('reading-value');

const READING_WPM = 225; // words per minute

// Utility functions for counts
function countWords(text){
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Split by any whitespace (handles multiple spaces, tabs, newlines)
  const parts = trimmed.split(/\s+/);
  // Filter out any empty strings just in case
  return parts.filter(Boolean).length;
}

function countCharacters(text){
  return text.length;
}

function countSentences(text){
  // Count occurrences of ., !, ? as sentence terminators.
  // Use regex to find groups of those characters.
  const matches = text.match(/[.!?]+/g);
  if (!matches) return 0;
  return matches.length;
}

function countParagraphs(text){
  // Split by one or more newlines, filter out empty/whitespace-only paragraphs
  const parts = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
  return parts.length;
}

function readingTimeSeconds(words){
  if (words === 0) return 0;
  // words / (words per minute) => minutes. Multiply by 60 to get seconds.
  const seconds = Math.round((words / READING_WPM) * 60);
  return seconds;
}

// Update UI
function updateStatsFromText(text){
  const words = countWords(text);
  const chars = countCharacters(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const seconds = readingTimeSeconds(words);

  wordsEl.textContent = words;
  charsEl.textContent = chars;
  sentencesEl.textContent = sentences;
  paragraphsEl.textContent = paragraphs;
  readingEl.textContent = `${seconds}s`;
}

// Event listeners
textarea.addEventListener('input', (e) => {
  updateStatsFromText(e.target.value);
});

// Clear button
clearBtn.addEventListener('click', (e) => {
  textarea.value = '';
  updateStatsFromText('');
  textarea.focus();
  // Optional small visual feedback: briefly flash the button (handled by :active)
});

// Copy button
copyBtn.addEventListener('click', async (e) => {
  const text = textarea.value;
  try {
    await navigator.clipboard.writeText(text);
    // Brief feedback: change icon to check for 900ms
    const icon = copyBtn.querySelector('i');
    const original = icon.className;
    icon.className = 'fa-solid fa-check';
    setTimeout(() => {
      icon.className = original;
    }, 900);
  } catch (err) {
    // If clipboard fails, fallback to selecting and execCommand (older browsers)
    try {
      textarea.select();
      document.execCommand('copy');
      const icon = copyBtn.querySelector('i');
      const original = icon.className;
      icon.className = 'fa-solid fa-check';
      setTimeout(() => {
        icon.className = original;
      }, 900);
    } catch (err2) {
      // final fallback: nothing. Could show an alert
      alert('Unable to copy to clipboard.');
    }
  }
});

// Initialize stats on load (in case any default text or browser restore)
updateStatsFromText(textarea.value);
