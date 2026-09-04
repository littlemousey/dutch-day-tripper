import { defineConfig } from 'vite';

export default defineConfig({
  // MapLibre's worker is an ES module that imports a sibling chunk, so it has
  // to be emitted as one too — see the WORKER_URL note in src/map.js.
  worker: { format: 'es' },
});
