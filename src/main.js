import '../style.css';
import { BUDGET_MODES, budgetMode, setBudgetMode, resetState } from './state.js';
import { initMap, mapExists, resetMapView } from './map.js';
import {
  renderStats,
  openPanel,
  closePanel,
  renderSummary,
  resetPanel,
  setDayEndHandler,
} from './ui.js';

const $ = (id) => document.getElementById(id);

// The budget is the difficulty setting: €25 makes every ticket a real decision
// and pushes you onto the HEMA-and-supermarket end of the food, €200 means the
// only thing you're rationing is the hours.
function renderModes() {
  const row = $('mode-row');
  row.innerHTML = BUDGET_MODES.map(
    (m) => `
      <button class="mode-chip ${m.id === budgetMode.id ? 'active' : ''}" data-mode="${m.id}">
        <span class="mode-amount">€${m.money}</span>
        <span class="mode-name">${m.label}</span>
        <span class="mode-note">${m.note}</span>
      </button>`,
  ).join('');

  row.querySelectorAll('.mode-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      setBudgetMode(btn.dataset.mode);
      renderModes();
    });
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
}

function startDay() {
  $('intro-modal').classList.remove('active');
  showScreen('screen-game');
  resetState();
  resetPanel();

  if (mapExists()) resetMapView();
  else initMap({ onSelect: openPanel });

  renderStats(null);
}

function endDay() {
  closePanel();
  renderSummary();
  showScreen('screen-summary');
}

setDayEndHandler(endDay);

renderModes();

$('btn-go-utrecht').addEventListener('click', () => {
  $('intro-budget').innerHTML = budgetMode.intro;
  $('intro-modal').classList.add('active');
});
$('btn-begin').addEventListener('click', startDay);
$('panel-close').addEventListener('click', closePanel);
$('end-day-btn').addEventListener('click', () => {
  if (confirm('End your day here and see how it went?')) endDay();
});
$('btn-again').addEventListener('click', () => showScreen('screen-start'));
