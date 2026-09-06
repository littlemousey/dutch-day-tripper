# Dutch Day Tripper

An interactive fiction day-trip game set in Dutch cities, starting with Utrecht.
Pick a city, land with a day's worth of time/money/energy, and spend it on
real locations around town — each with short narrative outcomes and a bit of
randomness. Utrecht currently has 27 locations and 65 activities, from the Dom
Tower and the Pandhof cloister garden to Broodje Mario, the Kanaalstraat in
Lombok and the university campus out on the Science Park. They add up to far
more than one 780-minute day holds, which is the point: you have to choose.

You pick a budget on the start screen, and it's the difficulty setting —
**€25 Shoestring** (HEMA sausages, supermarket picnics and everything free),
**€125 Day tripper** (three meals and a couple of tickets) or **€200 Blowout**.

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
tools/playtest.mjs  headless balance harness — plays the game as four
                    player archetypes and prints where they land
tools/geocheck.mjs  geocodes every pin against OpenStreetMap and reports
                    how far off it is (needs network)
```

Mood is not a score you pile up: it drifts back towards neutral, drains when you
haven't eaten or are worn out, and the day is judged on the state it left you
in — shown as a word (Delighted, Content, Flagging, Fed up) rather than a bare
number. Run `node tools/playtest.mjs` after changing any of those numbers, and
`node tools/geocheck.mjs` after moving or adding a pin.

The map uses MapLibre GL JS with OpenFreeMap's vector tiles, which need no API
key. Locations carry their real coordinates, and walking times between them are
derived from those, so the city's actual geography is what the game is played
against.

See `CLAUDE.md` for game design details and the roadmap.
