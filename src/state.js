// 09:00 -> 22:00
export const TOTAL_MIN = 13 * 60;

// Three ways to do a day in Utrecht. A tourist day realistically costs about €10
// for breakfast, €20 for lunch and €40-50 for dinner, which is what sets the
// middle number: €125 covers three meals and a couple of tickets, and not much
// else. €25 is the shoestring version — HEMA, supermarket picnics, free things,
// and real discipline about it. €200 is not counting.
export const BUDGET_MODES = [
  {
    id: 'shoestring',
    label: 'Shoestring',
    money: 25,
    note: 'Hard mode',
    intro:
      "You're carrying <strong>€25</strong> for the whole day. That's a HEMA sausage, a supermarket picnic and a great deal of looking at things from the outside — which is a perfectly good way to see Utrecht, and much harder to do well.",
  },
  {
    id: 'daytripper',
    label: 'Day tripper',
    money: 125,
    note: 'The intended day',
    intro:
      "You're carrying <strong>€125</strong> for the day — breakfast, lunch and dinner will take a good half of that, so what's left decides how much of Utrecht you actually get inside.",
  },
  {
    id: 'blowout',
    label: 'Blowout',
    money: 200,
    note: 'Not counting',
    intro:
      "You're carrying <strong>€200</strong> for the day. You can eat properly, buy any ticket that takes your fancy and still go home with change. The one thing the money can't buy you more of is the hours.",
  },
];

export let budgetMode = BUDGET_MODES[1];

export function setBudgetMode(id) {
  budgetMode = BUDGET_MODES.find((m) => m.id === id) || budgetMode;
  return budgetMode;
}

// You step off the train having eaten something on the way, which carries you
// to about 11:30. After that the day has to feed you.
export const ARRIVE_FED_UNTIL = 150;

export let state = freshState();

export function freshState() {
  return {
    time: 0,
    money: budgetMode.money,
    energy: 100,
    mood: 50,
    fedUntil: ARRIVE_FED_UNTIL,
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
