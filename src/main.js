import '../style.css';
import { resetState } from './state.js';
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

$('btn-go-utrecht').addEventListener('click', () => $('intro-modal').classList.add('active'));
$('btn-begin').addEventListener('click', startDay);
$('panel-close').addEventListener('click', closePanel);
$('end-day-btn').addEventListener('click', () => {
  if (confirm('End your day here and see how it went?')) endDay();
});
$('btn-again').addEventListener('click', () => showScreen('screen-start'));
