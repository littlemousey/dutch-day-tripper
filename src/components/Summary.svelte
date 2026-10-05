<script>
  import { game } from '../game.svelte.js';
  import { formatMoney } from '../state.js';

  let { onagain } = $props();
</script>

<div class="summary-card">
  <div class="summary-eyebrow">{game.clock} · the day is done · {game.modeLabel}</div>
  <div class="summary-tier">{game.tier}</div>
  <div class="summary-stats">
    <div class="sstat">
      <div class="sstat-val" id="sum-mood">{game.moodWord}</div>
      <div class="sstat-lab">Went home · {Math.round(game.mood)}/100</div>
    </div>
    <div class="sstat"><div class="sstat-val">{game.visitedCount}</div><div class="sstat-lab">Places seen</div></div>
    <div class="sstat"><div class="sstat-val">{formatMoney(game.money)}</div><div class="sstat-lab">Left over</div></div>
    <div class="sstat"><div class="sstat-val">{game.energy}</div><div class="sstat-lab">Energy left</div></div>
  </div>
  <div class="journal-title">Your day, in short</div>
  <div id="journal">
    {#each game.log as entry}
      <div class="journal-entry">
        <div class="journal-time">{entry.time}</div>
        <div class="journal-text">{entry.text}</div>
      </div>
    {:else}
      <div class="journal-entry">
        <div class="journal-text">You barely left the station platform. Sometimes a day is just a day.</div>
      </div>
    {/each}
  </div>
  <div class="summary-actions">
    <button class="btn primary" onclick={onagain}>Play another day →</button>
  </div>
</div>
