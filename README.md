# Dutch Day Tripper

An interactive fiction day-trip game set in Dutch cities, starting with Utrecht.
Pick a city, land with a day's worth of time/money/energy, and spend it on
real locations around town — each with short narrative outcomes and a bit of
randomness.

## Running it

```
npm install
npm run dev
```

Then open the URL Vite prints. `npm run build` produces a static bundle in
`dist/`.

## Layout

```
index.html          markup for all three screens (start / game / summary)
style.css           full stylesheet
src/main.js         bootstrap and screen wiring
src/state.js        game state plus clamp/format helpers
src/locations.js    LOCATIONS data, categories, travel flavour text
src/activities.js   travel cost, activity resolution, scoring
src/map.js          MapLibre init, pin markers, player marker
src/ui.js           stat bar, activity panel, summary/journal rendering
```

The map uses MapLibre GL JS with OpenFreeMap's vector tiles, which need no API
key.

`prototype/utrecht-day-out.html` is the original single-file version, kept as a
reference. It is no longer the thing you run.

See `CLAUDE.md` for game design details and the roadmap.
