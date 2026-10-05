import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],

  // Relative asset URLs, so the build works wherever it is served from —
  // GitHub Pages puts a project site under /<repo>/, a custom domain at the
  // root. Safe here because the app is a single page with no client-side
  // routing.
  base: './',

  // MapLibre's worker is an ES module that imports a sibling chunk, so it has
  // to be emitted as one too — see the WORKER_URL note in src/map.js.
  worker: { format: 'es' },
});
