// Headless balance harness: plays the real game modules (no DOM involved) as a
// handful of player archetypes and reports where each one lands. Run it after
// touching any mood, money or energy number:
//
//     node tools/playtest.mjs
//
// What to look for: all five ending tiers should be reachable, the careful
// planner should land in the 90s without routinely hitting 100, and the player
// who never stops to eat should end the day hungry, knackered and well down.

const SRC = new URL('../src/', import.meta.url).href;
const { LOCATIONS } = await import(SRC + 'locations.js');
const st = await import(SRC + 'state.js');
const A = await import(SRC + 'activities.js');

// Each archetype scores the candidate moves; the harness plays the best one.
const archetypes = {
  'careful planner': (loc, act, tot, s) => {
    let v = expected(act) / tot;
    if (A.isHungry() && act.meal) v += 1.2;            // eat when hungry
    if (A.isWornOut() && act.energy > 0) v += 1.0;     // sit down when knackered
    return v;
  },
  'culture vulture': (loc, act) => expected(act),      // best thing, damn the cost
  'skinflint': (loc, act, tot) => expected(act) / (tot * (1 + act.money)),
  'random tourist': () => Math.random(),
  // a floor probe rather than a plausible player: always walk to the furthest
  // thing, never eat, never sit down. Proves the bottom tier is reachable.
  'death march': (loc, act, tot) => tot - (act.meal ? 500 : 0) - (act.energy > 0 ? 500 : 0),
};
const expected = (a) => a.random ? a.random.chance * a.random.good.mood + (1 - a.random.chance) * a.random.bad.mood : a.mood;

function playOnce(score) {
  const state = st.resetState();
  for (;;) {
    let best = null;
    for (const loc of LOCATIONS) {
      const travel = A.travelMinutes(state.currentLoc, loc.id);
      for (const act of loc.activities) {
        const b = A.isBlocked(loc, act, travel);
        if (b.isDone || b.notEnoughTime || b.notEnoughMoney || b.notEnoughEnergy || b.tooEarly || b.tooLate) continue;
        const v = score(loc, act, b.totalTime, state);
        if (!best || v > best.v) best = { v, loc, act, travel };
      }
    }
    if (!best) break;
    A.doActivity(best.loc.id, best.act.id, best.travel);
    if (A.dayIsOver()) break;
  }
  const { score: final, tier, visitedCount } = A.finalScore();
  return { final, tier, mood: state.mood, energy: state.energy, money: state.money,
           time: state.time, acts: state.log.length, places: visitedCount,
           hungryAtEnd: A.isHungry(), wornOut: A.isWornOut() };
}

const runs = 200;
for (const mode of st.BUDGET_MODES) {
  st.setBudgetMode(mode.id);
  console.log(`\n=== ${mode.label} (€${mode.money})`);
  console.log('archetype        score (min/med/max)   mood  energy  spent  did  places  ends hungry/tired');
  for (const [name, score] of Object.entries(archetypes)) {
  const rs = Array.from({ length: runs }, () => playOnce(score));
  const q = (k, p) => rs.map(r => r[k]).sort((a, b) => a - b)[Math.floor(runs * p)];
  const avg = (k) => rs.reduce((n, r) => n + r[k], 0) / runs;
  console.log(
    name.padEnd(17) +
    `${q('final',0)}/${q('final',0.5)}/${q('final',0.98)}`.padEnd(22) +
    avg('mood').toFixed(0).padStart(4) + avg('energy').toFixed(0).padStart(8) +
    ('EUR' + (mode.money - avg('money')).toFixed(0)).padStart(8) + avg('acts').toFixed(0).padStart(5) +
    avg('places').toFixed(0).padStart(8) +
    ('   ' + Math.round(100 * rs.filter(r => r.hungryAtEnd).length / runs) + '% / ' +
     Math.round(100 * rs.filter(r => r.wornOut).length / runs) + '%').padStart(16));
  }
}
st.setBudgetMode('daytripper');
const tiers = {};
for (const mode of st.BUDGET_MODES) {
  st.setBudgetMode(mode.id);
  for (const [name, score] of Object.entries(archetypes))
    for (let i = 0; i < runs; i++) { const t = playOnce(score).tier; tiers[t] = (tiers[t] || 0) + 1; }
}
console.log('\ntiers reached across all modes and archetypes:');
for (const [t, n] of Object.entries(tiers).sort((a,b)=>b[1]-a[1])) console.log('  ' + String(n).padStart(4) + '  ' + t);
