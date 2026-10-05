<script>
  import { game } from '../game.svelte.js';
  import { formatMoney } from '../state.js';

  const FLASHED = ['money', 'energy', 'mood'];
  const PULSE_MS = 300;

  // Which way each stat last moved (green or red until it moves again), and
  // which are mid-pulse. At 09:00 nothing has happened yet, so a fresh day
  // clears them rather than flashing the reset to a full budget as a gain.
  const NO_TREND = { money: '', energy: '', mood: '' };
  let trend = $state({ ...NO_TREND });
  let pulsing = $state({ money: false, energy: false, mood: false });
  let prev = { money: game.money, energy: game.energy, mood: game.mood };
  const timers = {};

  $effect(() => {
    const now = { money: game.money, energy: game.energy, mood: game.mood };
    if (game.time === 0) {
      trend = { ...NO_TREND };
    } else {
      for (const key of FLASHED) {
        if (now[key] === prev[key]) continue;
        trend[key] = now[key] > prev[key] ? 'up' : 'down';
        pulsing[key] = true;
        clearTimeout(timers[key]);
        timers[key] = setTimeout(() => (pulsing[key] = false), PULSE_MS);
      }
    }
    prev = now;
  });

  let needs = $derived([game.hungry && 'hungry', game.wornOut && 'worn out'].filter(Boolean).join(' · '));
</script>

<div class="stat-strip">
  <div class="stat">
    <div class="stat-label">Time</div>
    <div class="stat-value">{game.clock}</div>
  </div>
  <div class="stat">
    <div class="stat-label">Budget</div>
    <div class={['stat-value', trend.money, pulsing.money && 'pulse']}>{formatMoney(game.money)}</div>
  </div>
  <div class="stat">
    <div class="stat-label">Energy</div>
    <div class={['stat-value', trend.energy, pulsing.energy && 'pulse']}>{game.energy}</div>
  </div>
  <div class="stat stat-mood">
    <div class="stat-label">Mood</div>
    <div class={['stat-value', trend.mood, pulsing.mood && 'pulse']}>
      <span>{game.moodWord}</span><span class="stat-num">{Math.round(game.mood)}</span>
    </div>
    <div class="stat-needs">{needs}</div>
  </div>
</div>
