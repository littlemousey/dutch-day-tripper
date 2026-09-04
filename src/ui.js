import { CAT_LABELS, findLocation } from './locations.js';
import { state, clockLabel, formatMoney } from './state.js';
import { travelMinutes, isBlocked, doActivity, dayIsOver, finalScore } from './activities.js';
import { updatePlayerMarker, refreshPinStyles } from './map.js';

const $ = (id) => document.getElementById(id);

let pendingTravel = 0;
let onDayEnd = () => {};

export function setDayEndHandler(fn) {
  onDayEnd = fn;
}

// ---------------- STATS ----------------
function flashStat(id, dir) {
  const el = $(id);
  el.classList.remove('up', 'down');
  void el.offsetWidth;
  el.classList.add(dir > 0 ? 'up' : 'down', 'pulse');
  setTimeout(() => el.classList.remove('pulse'), 300);
}

export function renderStats(prev) {
  $('stat-time').textContent = clockLabel(state.time);
  $('stat-money').textContent = formatMoney(state.money);
  $('stat-energy').textContent = state.energy;
  $('stat-mood').textContent = state.mood;
  if (!prev) return;
  if (state.money !== prev.money) flashStat('stat-money', state.money - prev.money);
  if (state.energy !== prev.energy) flashStat('stat-energy', state.energy - prev.energy);
  if (state.mood !== prev.mood) flashStat('stat-mood', state.mood - prev.mood);
}

// ---------------- PANEL ----------------
export function openPanel(locId) {
  const loc = findLocation(locId);
  pendingTravel = travelMinutes(state.currentLoc, locId);

  $('panel-cat').textContent = CAT_LABELS[loc.cat];
  $('panel-title').textContent = loc.name;
  $('panel-travel').textContent = pendingTravel > 0
    ? `🚶 about ${pendingTravel} min to get here`
    : "You're already here";

  renderPanelBody(loc, true);
  $('panel').classList.add('open');
}

export function closePanel() {
  $('panel').classList.remove('open');
}

function activityMarkup(loc, act) {
  const { isDone, notEnoughTime, notEnoughMoney, notEnoughEnergy, tooEarly, totalTime } =
    isBlocked(loc, act, pendingTravel);
  const blocked = isDone || notEnoughTime || notEnoughMoney || notEnoughEnergy || tooEarly;

  let note = '';
  if (isDone) note = 'Already done today.';
  else if (tooEarly) note = 'Not open yet — try again later in the day.';
  else if (notEnoughTime) note = 'Not enough daylight left.';
  else if (notEnoughMoney) note = "You can't afford this right now.";
  else if (notEnoughEnergy) note = "You're too tired — rest up somewhere first.";

  return `
    <div class="activity ${blocked ? 'disabled' : ''}">
      <div class="activity-label">${act.label}</div>
      <div class="activity-costs">
        <span class="cost-chip">⏱ ${totalTime} min</span>
        <span class="cost-chip">€ ${act.money.toFixed(2).replace(/\.00$/, '')}</span>
        <span class="cost-chip">⚡ ${act.energy > 0 ? '+' : ''}${act.energy}</span>
      </div>
      ${note ? `<div class="activity-note">${note}</div>` : ''}
      <button class="pick-btn" data-loc="${loc.id}" data-act="${act.id}" ${blocked ? 'disabled' : ''}>Do this</button>
    </div>`;
}

function renderPanelBody(loc, showIntro) {
  const body = $('panel-body');
  body.innerHTML =
    (showIntro ? `<p>${loc.intro}</p>` : '') +
    loc.activities.map((act) => activityMarkup(loc, act)).join('');

  body.querySelectorAll('.pick-btn').forEach((btn) => {
    btn.addEventListener('click', () => pickActivity(btn.dataset.loc, btn.dataset.act));
  });
}

function outcomeMarkup({ act, moodDelta, text, flavor }) {
  const chips = [
    `<span class="delta-chip ${moodDelta >= 0 ? 'pos' : 'neg'}">Mood ${moodDelta >= 0 ? '+' : ''}${moodDelta}</span>`,
    act.energy !== 0
      ? `<span class="delta-chip ${act.energy >= 0 ? 'pos' : 'neg'}">Energy ${act.energy >= 0 ? '+' : ''}${act.energy}</span>`
      : '',
    act.money > 0 ? `<span class="delta-chip neg">-${formatMoney(act.money)}</span>` : '',
  ].join('');

  return `<div class="outcome-box"><p>${flavor}${text}</p><div class="delta-row">${chips}</div></div>`;
}

function pickActivity(locId, actId) {
  const result = doActivity(locId, actId, pendingTravel);
  pendingTravel = 0;

  renderStats(result.before);
  refreshPinStyles();
  updatePlayerMarker();

  $('panel-travel').textContent = "You're here now";
  renderPanelBody(result.loc, false);
  $('panel-body').insertAdjacentHTML('afterbegin', outcomeMarkup(result));

  if (dayIsOver()) setTimeout(onDayEnd, 500);
}

// ---------------- SUMMARY ----------------
export function renderSummary() {
  const { visitedCount, tier } = finalScore();

  $('sum-eyebrow').textContent = clockLabel(state.time) + ' · the day is done';
  $('sum-tier').textContent = tier;
  $('sum-mood').textContent = state.mood;
  $('sum-visited').textContent = visitedCount;
  $('sum-money').textContent = formatMoney(state.money);
  $('sum-energy').textContent = state.energy;

  const journal = $('journal');
  if (state.log.length === 0) {
    journal.innerHTML =
      '<div class="journal-entry"><div class="journal-text">You barely left the station platform. Sometimes a day is just a day.</div></div>';
  } else {
    journal.innerHTML = state.log
      .map(
        (e) =>
          `<div class="journal-entry"><div class="journal-time">${e.time}</div><div class="journal-text">${e.text}</div></div>`,
      )
      .join('');
  }
}

export function resetPanel() {
  pendingTravel = 0;
  closePanel();
}
