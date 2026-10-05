export default {
  compilerOptions: {
    // Svelte 5 only. Most Svelte code online is still Svelte 4 (`export let`,
    // `$:`, `on:click`), and a component that mixes the two still compiles in
    // the default mode. Forcing runes makes the old syntax a compile error.
    runes: true,
  },
};
