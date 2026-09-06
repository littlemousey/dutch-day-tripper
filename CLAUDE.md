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
/tools
  playtest.mjs      headless balance harness (`node tools/playtest.mjs`)
  geocheck.mjs      coordinate audit against OpenStreetMap
```

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
  covered at the same number. `DEFAULT_ZOOM` is 13.3, which frames the old city
  centre. The opening view holds that zoom fixed and only picks what to centre
  on (`cityView()` in `src/map.js`): the bounds of all locations when the
  viewport is wide enough to hold them, otherwise Domplein. Fitting the bounds
  outright was tried and rejected — the Science Park sits ~4.5km east of the
  station, so the fit zooms out far enough that the whole city centre collapses
  into a single cluster badge on a phone.

Pins are DOM markers driven by a clustered GeoJSON source (`src/map.js`), not
map layers — that keeps the teardrop-and-emoji design while still getting real
clustering for the overlapping centre locations. The source is queried on each
move; the invisible `locations-anchor` layer exists only because MapLibre
builds tiles for a source when some layer references it.

CARTO's Voyager tiles (what the original prototype used) now require an API
key and serve an "API KEY REQUIRED" watermark with HTTP 200, so a `tileerror`
fallback can never detect it. Don't go back to them without a key.

Keep it plain JS/HTML/CSS (no framework needed) unless you have a strong
reason to reach for one — this app has one screen with a few states, some
DOM updates, and a map. A framework would add more surface area, not less.

## Game design spec

**Resources**, tracked across the whole day:
- `time`: minutes elapsed since 09:00; the day ends at 22:00 (780 total
  minutes budget)
- `money`: chosen on the start screen from three budget modes, which are the
  game's difficulty setting (`BUDGET_MODES` in `state.js`):
  **Shoestring €25** (HEMA, supermarket picnics, free things, real discipline),
  **Day tripper €125** (the intended day: a realistic Utrecht day is ~€10
  breakfast, ~€20 lunch and €40-50 dinner, so three meals eat half of it), and
  **Blowout €200**. The player is not meant to spend it all
- `energy`: 0–100, starts at 100. Walking costs it (1 point per 12 minutes of
  travel), so pace is what empties you, not the activities
- `mood`: 0–100, starts at 50 — the score, but not a pile you accumulate. The
  UI leads with a word, not the number (`moodLabel()`: Delighted / Glowing /
  Cheerful / Content / Steady / Flagging / Fed up / Wretched), with the figure
  small beside it and a `hungry · worn out` line under it, so the player can see
  what the day is doing to them without doing arithmetic

**Mood is a state, not a total.** It is the condition the day has left you in,
and three things pull it down between one activity and the next (all in
`strain()` in `activities.js`, with the constants at the top of that file):

- **fade** — mood drifts back towards a neutral 45, half the distance every 240
  minutes. A brilliant morning cannot be banked and carried home; the day has to
  keep earning it, and the last few hours count for the most.
- **hunger** — activities with a `meal` tag set `state.fedUntil` (a real meal
  buys 4 hours, `meal: 'snack'` buys 2). Past that, mood bleeds 4 an hour until
  you eat. You arrive fed until 11:30.
- **fatigue** — below 40 energy mood drains too, up to 8 an hour at zero.

So the budget has to cover food or the day sags, and marching from one end of
the city to the other all afternoon costs more than the walking time. Activity
mood values are small on purpose (+1 to +13); the bad half of a random outcome
can be negative, and the worst of them — a €42 dinner that turns out mediocre,
a cloudy observatory slot — genuinely are. `ui.js` shows the breakdown as chips
on the outcome (`Mood +9  Hungry -7  Glow fades -4`) and warns in the panel
when you are hungry or worn out, with the nearest fix; without that the number
just appears to drop for no reason.

**Balance is checked, not guessed**: `node tools/playtest.mjs` plays the real
modules as five archetypes across all three budget modes and prints where they
land. Run it after touching any number. Current spread on Day tripper: a careful
planner who eats and rests lands 89-100, a culture vulture who does neither
lands 40-69 and ends the day knackered, free-things-only lands about 71, and the
"death march" floor probe (furthest thing every time, never eats, never sits
down) lands 34-56. All five ending tiers get reached.

**Locations**: real lat/lng coordinates in Utrecht. Each has a category
(culture / food / shopping / nature / transport — used for pin color), an
intro text (shown the first time you open its panel), and 1–4 activities.

**Activities**: each has a time cost, money cost, and energy delta. Mood
outcome is either fixed or `random: { chance, good: {mood, text}, bad:
{mood, text} }` for a bit of replay variance. Some are time-gated
(`minMinutes` for evening-only bars, `maxMinutes` for things that are over by
mid-afternoon, like the free lunchtime concert). Once done, an activity is
marked complete and can't be repeated (`doneActivities` set, keyed
`${locationId}:${activityId}`) — unless it sets `repeatable: true`, which only
the station bench does. That bench is the floor of the game: a player with an
empty wallet can always still do *something*. `isLocationExhausted()` ignores
repeatable activities, so the station pin never greys out.

**Running out of money** is a legitimate state, not a dead end. When every
activity at a location is blocked and at least one of them is blocked on price,
the panel prints what is still free, nearest first (`brokeNote()` in `ui.js`,
fed by `freeActivitiesLeft()`). 13 of the 49 activities are free.

**Travel time**: computed from haversine distance between the player's
current location and the target, ×1.3 for route inefficiency, ÷ walking
speed (4.8 km/h), rounded to the nearest 5 minutes, minimum 5. This is
charged once per "visit" (i.e., not re-charged if you pick a second activity
at the same location without leaving).

**Ending**: either the player clicks "End the day," or remaining time drops
below 10 minutes (auto-ends). Final score = `mood + min(10, distinctLocationsVisited * 2)`,
mapped to a narrative tier (from "The Perfect Utrecht Day" down to "A Rough
Day in Utrecht"). The thresholds (90/72/55/38) are cut to the range the needs
model actually produces — all five tiers are reachable; re-check them with the
playtester if the numbers move. A journal/diary of the day's outcome texts is
shown on the summary screen.

**Current Utrecht locations** (27, including the start point), 65 activities:
Utrecht Centraal (start), Domplein & Dom Tower, Pieterskerk, Museum Speelklok,
HEMA on the Steenweg, Sonnenborgh Observatory, Academiegebouw & Pandhof,
Oudegracht Wharf, De Oude Muntkelder, Broodje Mario, Centraal Museum, Louis
Hartlooper Complex, Nijntje (Miffy) Museum, Rietveld Schröderhuis,
Wilhelminapark, Nijntje Pleintje, Vredenburg & Hoog Catharijne, Lombok & the
Kanaalstraat, Jaarbeurs, Oog in Al & the old Mint, TivoliVredenburg,
Stadsschouwburg Utrecht, Winkel van Sinkel, Spoorwegmuseum, Neude Square,
Utrecht Science Park, Utrecht Botanic Gardens.

**The economy.** Those 62 activities add up to €541 and 2880 minutes against a
780-minute day, so a day fits roughly a quarter of the board whatever the
budget. 18 activities are free and 11 of the 23 meals cost €5 or less, which is
what makes Shoestring playable rather than merely bleak.

What the modes actually do, per `tools/playtest.mjs`: at €25 money is the whole
game (the simulated careful planner tops out around 84 and ends every day
hungry — you cannot buy your way to a perfect day); at €125 time and money bind
about equally, which is the intended balance; at €200 money stops binding at
all — the same simulated player spends about €108 in both €125 and €200 mode,
because what runs out is the hours, not the cash. Blowout is therefore
"difficulty off" rather than a different shape of day. The fix, if it ever
matters, is giving money something to buy that isn't an activity: an OV-fiets or
a canal taxi that trades euros for travel time.

Energy is net positive across the whole set and effectively never binds; treat
it as flavour unless that changes. When adding activities, keep the ratio in
mind: cheap-or-free sights are what make a broke afternoon playable, and the
expensive highlights (concerts, guided tours, a real dinner) are what make the
budget a decision rather than a formality.

**Coordinates are audited, not remembered.** `node tools/geocheck.mjs` geocodes
every pin against OpenStreetMap and prints the distance; everything is currently
within 63m of the real thing (Domplein being a square). Run it after adding a
location. This matters more than it looks: travel times are computed from these
coordinates, so a pin in the wrong place quietly makes the whole day wrong — the
Spoorwegmuseum sat 1.5km north-west of the actual Maliebaanstation for a while,
and Nijntje Pleintje was on the Jansveld when it is really up on the
Breedstraat, a 25-minute walk from the nijntje museum rather than 15. Copy that
states a distance or a direction has to be re-checked when a pin moves.

The Science Park pair is the one real excursion — about 70 minutes on foot from
the station each way, since the game only models walking — so their mood payoffs
are tuned a little high to compensate. If that trip ever needs to feel less
punishing, the honest fix is modelling the tram, not moving the pins.

## Visual design intent

Palette and type choices carried over from the original prototype, worth
keeping consistent:
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
2. Persist a finished day (e.g. via `localStorage` or a simple backend) so
   people can compare runs / share a result.
3. A second city (Amsterdam or Delft are natural next picks) — the data
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
