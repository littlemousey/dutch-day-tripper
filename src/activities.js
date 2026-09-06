import { LOCATIONS, TRAVEL_FLAVOR, findLocation } from './locations.js';
import { state, clamp, clockLabel, activityKey, TOTAL_MIN } from './state.js';

const WALK_KMH = 4.8;
const ROUTE_INEFFICIENCY = 1.3;

// Mood is not a score that accumulates — it's the state the day has left you in,
// and three things pull it down between one activity and the next.
//
//   fade    whatever you last did stops glowing; mood drifts back towards a
//           neutral 45, so a brilliant morning can't be banked and walked home
//           with. The day has to keep earning it.
//   hunger  every activity that feeds you sets `fedUntil`; past that, mood
//           bleeds until you eat again.
//   fatigue below 40 energy everything is harder work, and the deeper you go
//           the faster mood drains.
//
// Walking now costs energy too, which is what makes pace matter: criss-crossing
// the city all day is what empties you, not the activities themselves.
const MOOD_BASELINE = 45;
const MOOD_HALF_LIFE = 240; // minutes for half the distance from baseline to fade
const MEAL_FEEDS_FOR = 240;
const SNACK_FEEDS_FOR = 120;
const HUNGER_PER_HOUR = 4;
const TIRED_BELOW = 40;
const TIRED_PER_HOUR = 8;
const TRAVEL_MIN_PER_ENERGY = 12;

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
    // A repeatable activity (sitting out a while at the station) is the floor of
    // the game: something a player with no money left can always still do.
    isDone: !act.repeatable && state.doneActivities.has(activityKey(loc.id, act.id)),
    notEnoughTime: state.time + totalTime > TOTAL_MIN,
    notEnoughMoney: act.money > state.money + 1e-6,
    notEnoughEnergy: act.energy < 0 && Math.abs(act.energy) > state.energy,
    tooEarly: !!act.minMinutes && state.time < act.minMinutes,
    // some things only happen at one time of day — a free lunchtime concert is
    // not something you can turn up to at nine in the evening
    tooLate: !!act.maxMinutes && state.time > act.maxMinutes,
    totalTime,
  };
}

export function travelEnergy(minutes) {
  return Math.round(minutes / TRAVEL_MIN_PER_ENERGY);
}

// What the passing of `minutes` does to mood on its own, before the activity at
// the end of them is worth anything. Returned itemised so the panel can show
// the player why they feel worse than the last outcome text suggested.
function strain(minutes, energyAfter) {
  const from = state.time;
  const to = state.time + minutes;

  const fade = (MOOD_BASELINE - state.mood) * (1 - 0.5 ** (minutes / MOOD_HALF_LIFE));
  const hungryMinutes = Math.max(0, to - Math.max(from, state.fedUntil));
  const hunger = -(hungryMinutes / 60) * HUNGER_PER_HOUR;
  const tired =
    energyAfter < TIRED_BELOW
      ? -((TIRED_BELOW - energyAfter) / TIRED_BELOW) * (minutes / 60) * TIRED_PER_HOUR
      : 0;

  return { fade, hunger, tired };
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

  const minutes = pendingTravel + act.time;
  const energyAfter = clamp(state.energy - travelEnergy(pendingTravel) + act.energy, 0, 100);
  const wear = strain(minutes, energyAfter);

  state.time += minutes;
  state.money = Math.round((state.money - act.money) * 100) / 100;
  state.energy = energyAfter;
  state.mood = clamp(state.mood + wear.fade + wear.hunger + wear.tired + moodDelta, 0, 100);
  if (act.meal) {
    state.fedUntil = state.time + (act.meal === 'snack' ? SNACK_FEEDS_FOR : MEAL_FEEDS_FOR);
  }
  state.currentLoc = locId;
  state.doneActivities.add(activityKey(locId, actId));
  state.visitedLocs.add(locId);
  state.log.push({ time: clockLabel(state.time), text: flavor + text });

  return { act, loc, moodDelta, text, flavor, before, wear };
}

// A number out of 100 doesn't tell the player anything. The word does, and it's
// what the summary and the top bar lead with; the number stays alongside it so
// the arithmetic is still followable.
const MOOD_LADDER = [
  [90, 'Delighted'],
  [78, 'Glowing'],
  [66, 'Cheerful'],
  [54, 'Content'],
  [42, 'Steady'],
  [30, 'Flagging'],
  [18, 'Fed up'],
  [0, 'Wretched'],
];

export function moodLabel(mood = state.mood) {
  return MOOD_LADDER.find(([floor]) => mood >= floor)[1];
}

export function isHungry() {
  return state.time > state.fedUntil;
}

export function isWornOut() {
  return state.energy < TIRED_BELOW;
}

export function isLocationExhausted(loc) {
  const finite = loc.activities.filter((a) => !a.repeatable);
  return finite.length > 0 && finite.every((a) => state.doneActivities.has(activityKey(loc.id, a.id)));
}

// Still-doable activities matching a predicate, nearest first. Used to answer
// the three questions the panel asks on the player's behalf: what can I still
// afford, where do I eat, and where can I sit down.
function optionsLeft(fromLocId, match) {
  const out = [];
  for (const loc of LOCATIONS) {
    const travel = travelMinutes(fromLocId, loc.id);
    for (const act of loc.activities) {
      if (!match(act)) continue;
      if (!act.repeatable && state.doneActivities.has(activityKey(loc.id, act.id))) continue;
      if (state.time + travel + act.time > TOTAL_MIN) continue;
      out.push({ loc, act, travel });
    }
  }
  return out.sort((a, b) => a.travel - b.travel);
}

export function freeActivitiesLeft(fromLocId) {
  return optionsLeft(fromLocId, (act) => act.money === 0);
}

export function foodNearby(fromLocId) {
  return optionsLeft(fromLocId, (act) => act.meal && act.money <= state.money);
}

export function restNearby(fromLocId) {
  return optionsLeft(fromLocId, (act) => act.energy >= 10 && act.money <= state.money);
}

export function dayIsOver() {
  return TOTAL_MIN - state.time < 10;
}

export function finalScore() {
  const visitedCount = Array.from(state.visitedLocs).filter((id) => id !== 'centraal').length;
  const bonus = Math.min(10, visitedCount * 2);
  const score = Math.round(clamp(state.mood + bonus, 0, 100));

  // Cut to the range the needs model actually produces: simulated days land
  // between the mid-30s (marched about all day on an empty stomach) and the
  // high 90s (fed, rested, well routed). The old thresholds were set when mood
  // could only go up, and left the bottom two tiers unreachable.
  let tier;
  if (score >= 90) tier = 'The Perfect Utrecht Day';
  else if (score >= 72) tier = 'A Lovely Day Out';
  else if (score >= 55) tier = 'A Decent Wander';
  else if (score >= 38) tier = "Could've Gone Better";
  else tier = 'A Rough Day in Utrecht';

  return { visitedCount, score, tier };
}
