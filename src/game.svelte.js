import { state, budgetMode, clockLabel } from './state.js';
import { moodLabel, isHungry, isWornOut, finalScore } from './activities.js';

// The game itself stays a plain object in state.js, so tools/playtest.mjs can
// run the real modules in Node without a compiler. Svelte can't see changes to
// a plain object, so components read this reactive copy instead, and whatever
// changes the game calls sync() afterwards.
function snapshot() {
  const { visitedCount, tier } = finalScore();
  return {
    time: state.time,
    clock: clockLabel(state.time),
    money: state.money,
    energy: state.energy,
    mood: state.mood,
    moodWord: moodLabel(),
    hungry: isHungry(),
    wornOut: isWornOut(),
    modeLabel: budgetMode.label,
    visitedCount,
    tier,
    log: [...state.log],
  };
}

export const game = $state(snapshot());

export function sync() {
  Object.assign(game, snapshot());
}
