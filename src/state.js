// 09:00 -> 22:00
export const TOTAL_MIN = 13 * 60;

export const START_MONEY = 70;

export let state = freshState();

export function freshState() {
  return {
    time: 0,
    money: START_MONEY,
    energy: 100,
    mood: 50,
    currentLoc: 'centraal',
    doneActivities: new Set(),
    visitedLocs: new Set(['centraal']),
    log: [],
  };
}

export function resetState() {
  state = freshState();
  return state;
}

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

export function clockLabel(elapsed) {
  const total = 9 * 60 + elapsed;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

export function formatMoney(amount) {
  return '€' + amount.toFixed(2).replace(/\.00$/, '');
}

export function activityKey(locId, actId) {
  return locId + ':' + actId;
}
