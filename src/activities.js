import { TRAVEL_FLAVOR, findLocation } from './locations.js';
import { state, clamp, clockLabel, activityKey, TOTAL_MIN } from './state.js';

const WALK_KMH = 4.8;
const ROUTE_INEFFICIENCY = 1.3;

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function travelMinutes(fromLoc, toLoc) {
  if (fromLoc === toLoc) return 0;
  const km = haversine(findLocation(fromLoc), findLocation(toLoc)) * ROUTE_INEFFICIENCY;
  const mins = (km / WALK_KMH) * 60;
  return Math.max(5, Math.round(mins / 5) * 5);
}

export function isBlocked(loc, act, pendingTravel) {
  const totalTime = pendingTravel + act.time;
  return {
    isDone: state.doneActivities.has(activityKey(loc.id, act.id)),
    notEnoughTime: state.time + totalTime > TOTAL_MIN,
    notEnoughMoney: act.money > state.money + 1e-6,
    notEnoughEnergy: act.energy < 0 && Math.abs(act.energy) > state.energy,
    tooEarly: !!act.minMinutes && state.time < act.minMinutes,
    totalTime,
  };
}

function resolveOutcome(act) {
  if (!act.random) return { moodDelta: act.mood, text: act.text };
  const roll = Math.random() < act.random.chance ? act.random.good : act.random.bad;
  return { moodDelta: roll.mood, text: roll.text };
}

// Applies an activity to the game state and returns what happened, so the
// caller can render it. Travel is charged once per visit: the caller passes
// the pending travel cost and resets it after.
export function doActivity(locId, actId, pendingTravel) {
  const loc = findLocation(locId);
  const act = loc.activities.find((a) => a.id === actId);
  const before = { money: state.money, energy: state.energy, mood: state.mood };

  const { moodDelta, text } = resolveOutcome(act);

  let flavor = '';
  if (pendingTravel >= 15 && Math.random() < 0.4) {
    flavor = TRAVEL_FLAVOR[Math.floor(Math.random() * TRAVEL_FLAVOR.length)] + ' ';
  }

  state.time += pendingTravel + act.time;
  state.money = Math.round((state.money - act.money) * 100) / 100;
  state.energy = clamp(state.energy + act.energy, 0, 100);
  state.mood = clamp(state.mood + moodDelta, 0, 100);
  state.currentLoc = locId;
  state.doneActivities.add(activityKey(locId, actId));
  state.visitedLocs.add(locId);
  state.log.push({ time: clockLabel(state.time), text: flavor + text });

  return { act, loc, moodDelta, text, flavor, before };
}

export function isLocationExhausted(loc) {
  return loc.activities.every((a) => state.doneActivities.has(activityKey(loc.id, a.id)));
}

export function dayIsOver() {
  return TOTAL_MIN - state.time < 10;
}

export function finalScore() {
  const visitedCount = Array.from(state.visitedLocs).filter((id) => id !== 'centraal').length;
  const bonus = Math.min(10, visitedCount * 2);
  const score = clamp(state.mood + bonus, 0, 100);

  let tier;
  if (score >= 85) tier = 'The Perfect Utrecht Day';
  else if (score >= 65) tier = 'A Lovely Day Out';
  else if (score >= 45) tier = 'A Decent Wander';
  else if (score >= 25) tier = "Could've Gone Better";
  else tier = 'A Rough Day in Utrecht';

  return { visitedCount, score, tier };
}
