import { CAT_LABELS, findLocation } from './locations.js';
import { state, budgetMode, clockLabel, formatMoney } from './state.js';
import {
  travelMinutes,
  isBlocked,
  doActivity,
  dayIsOver,
  finalScore,
  freeActivitiesLeft,
  moodLabel,
  foodNearby,
  restNearby,
  isHungry,
  isWornOut,
} from './activities.js';
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
  $('stat-mood-word').textContent = moodLabel();
  $('stat-mood-num').textContent = Math.round(state.mood);
  $('stat-mood-needs').textContent = [isHungry() && 'hungry', isWornOut() && 'worn out']
    .filter(Boolean)
    .join(' · ');
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
  const { isDone, notEnoughTime, notEnoughMoney, notEnoughEnergy, tooEarly, tooLate, totalTime } =
    isBlocked(loc, act, pendingTravel);
  const blocked = isDone || notEnoughTime || notEnoughMoney || notEnoughEnergy || tooEarly || tooLate;

  let note = '';
  if (isDone) note = 'Already done today.';
  else if (tooEarly) note = 'Not open yet — try again later in the day.';
  else if (tooLate) note = 'Over for today — that one is a lunchtime thing.';
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

// Several activities can sit at the same location; the player wants a list of
// places to walk to, not a list of things to do at one of them.
function nearestPlaces(options, limit, excludeLocId) {
  const seen = new Set(excludeLocId ? [excludeLocId] : []);
  return options
    .filter((o) => !seen.has(o.loc.id) && seen.add(o.loc.id))
    .slice(0, limit)
    .map((o) => `${o.loc.name} (${o.travel === 0 ? 'right here' : o.travel + ' min'})`);
}

// With an empty wallet a panel is just a wall of dead buttons, which reads like
// the game has stopped rather than like the day has changed shape. Say what is
// still open instead — free things, nearest first, and the station always is.
function brokeNote(loc) {
  const blocks = loc.activities.map((act) => isBlocked(loc, act, pendingTravel));
  const allBlocked = blocks.every(
    (b) =>
      b.isDone || b.notEnoughTime || b.notEnoughMoney || b.notEnoughEnergy || b.tooEarly || b.tooLate,
  );
  if (!allBlocked || !blocks.some((b) => b.notEnoughMoney)) return '';

  const options = nearestPlaces(freeActivitiesLeft(state.currentLoc), 3, loc.id);

  if (options.length === 0) {
    return `<div class="panel-hint">That's the budget gone, and there's nothing free left within the day. Head back to the station, or end the day whenever you like.</div>`;
  }
  return `<div class="panel-hint">Nothing here you can still afford. Still free today: ${options.join(', ')} — and there's always a bench at the station.</div>`;
}

// Hunger and fatigue drain mood quietly, between activities, so the player needs
// to be told they are happening — and told where the fix is, or the mechanic
// just reads as the number going down for no reason.
function needsNote() {
  const notes = [];
  if (isHungry()) {
    const food = nearestPlaces(foodNearby(state.currentLoc), 2);
    notes.push(
      food.length
        ? `You haven't eaten in a while, and it's costing you mood every hour. Food: ${food.join(', ')}.`
        : "You haven't eaten in a while, and it's costing you mood every hour — and there's nothing left you can afford to eat.",
    );
  }
  if (isWornOut()) {
    const rest = nearestPlaces(restNearby(state.currentLoc), 2);
    notes.push(
      rest.length
        ? `You're worn out, which drags on your mood the longer it goes on. Something restful: ${rest.join(', ')}.`
        : "You're worn out, which drags on your mood the longer it goes on.",
    );
  }
  return notes.map((n) => `<div class="panel-hint warn">${n}</div>`).join('');
}

function renderPanelBody(loc, showIntro) {
  const body = $('panel-body');
  body.innerHTML =
    (showIntro ? `<p>${loc.intro}</p>` : '') +
    needsNote() +
    loc.activities.map((act) => activityMarkup(loc, act)).join('') +
    brokeNote(loc);

  body.querySelectorAll('.pick-btn').forEach((btn) => {
    btn.addEventListener('click', () => pickActivity(btn.dataset.loc, btn.dataset.act));
  });
}

function wearChip(label, value, floor) {
  if (Math.abs(value) < floor) return '';
  const n = Math.round(value);
  if (n === 0) return '';
  return `<span class="delta-chip ${n >= 0 ? 'pos' : 'neg'}">${label} ${n > 0 ? '+' : ''}${n}</span>`;
}

function outcomeMarkup({ act, moodDelta, text, flavor, wear }) {
  const chips = [
    `<span class="delta-chip ${moodDelta >= 0 ? 'pos' : 'neg'}">Mood ${moodDelta >= 0 ? '+' : ''}${moodDelta}</span>`,
    wearChip('Hungry', wear.hunger, 0.5),
    wearChip('Worn out', wear.tired, 0.5),
    // the glow of the last thing always fades a little; only worth saying when
    // it's enough to notice
    wearChip(wear.fade >= 0 ? 'Picking up' : 'Glow fades', wear.fade, 2),
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

  $('sum-eyebrow').textContent =
    clockLabel(state.time) + ' · the day is done · ' + budgetMode.label;
  $('sum-tier').textContent = tier;
  $('sum-mood').textContent = moodLabel();
  $('sum-mood-lab').textContent = `Went home · ${Math.round(state.mood)}/100`;
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
