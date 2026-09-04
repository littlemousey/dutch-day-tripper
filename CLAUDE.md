# Dutch Day Tripper

An interactive fiction / resource-management game: the player picks a Dutch
city, lands with a day's worth of time, money, and energy, and spends it on
activities scattered across a real map of the city. Choices are narrative
(short story text, occasional branching/random outcomes) rather than purely
mechanical — think a cross between a "choose your own adventure" and a
light city-trip planner like *Wanderlust*.

Utrecht is the first (and currently only) city.

## Current state

A **Vite project** (plain JS, no framework). `npm install && npm run dev`.

```
/index.html         markup for all three screens (start / game / summary)
/style.css          full stylesheet
/vite.config.js
/src
  main.js           app bootstrap, screen/flow wiring
  state.js          game state, clamp/format helpers
  locations.js      LOCATIONS data, categories, travel flavour text
  activities.js     travel cost, activity resolution, scoring
  map.js            MapLibre init, pin markers, player marker
  ui.js             stat bar, activity panel, summary/journal rendering
```

`prototype/utrecht-day-out.html` is the original single-file version, kept as
a reference. It is no longer the thing you run.

Module boundaries: `map.js` takes an `onSelect` callback rather than importing
`ui.js`, so the imports stay acyclic (`main` -> `ui` -> `activities`/`map` ->
`state`/`locations`).

**The pin-click bug is fixed.** It was never a click-handling problem: `#map`
was `position:absolute` with `z-index:auto`, so it created no stacking context
and Leaflet's panes (z-index 200-700) painted over the pin layer and the
panel. Both were present and receiving clicks the whole time, just invisible.
`#map` now carries `z-index:0`. Note that `elementFromPoint` reports the pins
as topmost even when they are painted underneath, so DOM inspection *confirms
the wrong thing* here — screenshots are the only reliable check.

### Map library

**MapLibre GL JS** (npm) with **OpenFreeMap**'s `positron` vector style, which
needs no API key and suits the warm-paper palette. Two things to know:

- MapLibre locates its Web Worker relative to `import.meta.url`, which points
  into the bundle where no worker file exists. It then 404s and the map
  renders *nothing at all, with no error* — a blank basemap with working pins.
  `src/map.js` sets `config.WORKER_URL` from a `?worker&url` import to fix
  this; `vite.config.js` sets `worker.format: 'es'` to match.
- MapLibre serves 512px tiles, so a zoom level covers half the ground Leaflet
  covered at the same number. `DEFAULT_ZOOM` is 13.3, framing the city the way
  the prototype's Leaflet 14.3 did.

CARTO's Voyager tiles (used by the prototype) now require an API key and serve
an "API KEY REQUIRED" watermark with HTTP 200, so a `tileerror` fallback can
never detect it. Don't go back to them without a key.

Keep it plain JS/HTML/CSS (no framework needed) unless you have a strong
reason to reach for one — this app has one screen with a few states, some
DOM updates, and a map. A framework would add more surface area, not less.

## Game design spec (from the prototype — carry this forward)

**Resources**, tracked across the whole day:
- `time`: minutes elapsed since 09:00; the day ends at 22:00 (780 total
  minutes budget)
- `money`: starts at €70
- `energy`: 0–100, starts at 100
- `mood`: 0–100, starts at 50 — this is the score being optimized

**Locations**: real lat/lng coordinates in Utrecht. Each has a category
(culture / food / shopping / nature / transport — used for pin color), an
intro text (shown the first time you open its panel), and 1–3 activities.

**Activities**: each has a time cost, money cost, and energy delta. Mood
outcome is either fixed or `random: { chance, good: {mood, text}, bad:
{mood, text} }` for a bit of replay variance. Some are time-gated
(`minMinutes`, e.g. evening-only bars). Once done, an activity is marked
complete and can't be repeated (`doneActivities` set, keyed
`${locationId}:${activityId}`).

**Travel time**: computed from haversine distance between the player's
current location and the target, ×1.3 for route inefficiency, ÷ walking
speed (4.8 km/h), rounded to the nearest 5 minutes, minimum 5. This is
charged once per "visit" (i.e., not re-charged if you pick a second activity
at the same location without leaving).

**Ending**: either the player clicks "End the day," or remaining time drops
below 10 minutes (auto-ends). Final score = `mood + min(10, distinctLocationsVisited * 2)`,
mapped to a narrative tier (from "The Perfect Utrecht Day" down to "A Rough
Day in Utrecht"). A journal/diary of the day's outcome texts is shown on the
summary screen.

**Current Utrecht locations** (10, including the start point):
Utrecht Centraal (start), Domplein & Dom Tower, Oudegracht Wharf, Centraal
Museum, Nijntje (Miffy) Museum (+ Nijntje Pleintje / Miffy Square, free),
Vredenburg & Hoog Catharijne, Winkel van Sinkel, Utrecht Botanic Gardens,
Spoorwegmuseum, Neude Square (+ the public library in the old post office,
free).

## Visual design intent

Palette and type choices from the prototype, worth keeping consistent:
- Brick red `#A8432E` (canal wharf brick), deep canal green `#28433D`,
  sandstone `#E8DCC8`, ink `#201C18`, mustard `#C7961F`, warm paper
  background `#F6F1E7`.
- Display type: Fraunces (serif, for titles). Body: Inter. Stats/data:
  JetBrains Mono, styled loosely like a departure-board readout.
- The top stat bar (time / budget / energy / mood) is meant to feel like a
  transit/ticket display. The activity panel is a slide-in sheet (side panel
  on desktop, bottom sheet on mobile).

## Near-term roadmap (not urgent, in rough priority order)

1. **Mobile layout pass.** The bottom-sheet panel works, but the top bar
   breaks on a phone: the stat strip wraps to roughly 200px tall and leaves
   only a sliver of map. Observed at 390x844, not yet fixed.
2. **Overlapping pins.** At the default zoom, four or five pins stack on top
   of each other around Dom / Neude / Oudegracht, so the buried ones can't be
   clicked at all. Needs spreading, clustering, or zoom-dependent offsets.
3. Persist a finished day (e.g. via `localStorage` or a simple backend) so
   people can compare runs / share a result.
4. A second city (Amsterdam or Delft are natural next picks) — the data
   model already supports multiple cities via the city-select screen, which
   currently only unlocks Utrecht.

## Working style notes for you (Claude Code)

- Don't re-guess-and-patch on things that are actually observable. If a bug
  can be seen with devtools, look at it before changing code.
- Keep the tone and content in the spirit of the existing copy — warm,
  specific, a little wry, grounded in real Utrecht details rather than
  generic "you see a nice building" filler.
- Ask before doing large structural rewrites (e.g. switching to a framework,
  changing the whole map library) — small reversible steps are preferred
  given this is still an early prototype the user is iterating on.
