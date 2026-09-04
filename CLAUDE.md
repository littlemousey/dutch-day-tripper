# Dutch Day Tripper

An interactive fiction / resource-management game: the player picks a Dutch
city, lands with a day's worth of time, money, and energy, and spends it on
activities scattered across a real map of the city. Choices are narrative
(short story text, occasional branching/random outcomes) rather than purely
mechanical — think a cross between a "choose your own adventure" and a
light city-trip planner like *Wanderlust*.

Utrecht is the first (and currently only) city.

## Current state

There is a **single-file HTML prototype** at `prototype/utrecht-day-out.html`.
It was built conversationally in Claude.ai's artifact sandbox and works there,
but the whole point of moving to a real repo is to get it running (and
debuggable) in an actual browser with devtools, since the sandbox couldn't be
inspected directly.

**Known bug, unresolved:** the map pins do not respond to clicks, in both the
Claude.ai artifact preview and a locally downloaded copy opened directly as a
file. Several fixes were tried blind (Leaflet's built-in marker click
handling, binding click listeners directly to marker DOM nodes, and finally
rebuilding pins as plain absolutely-positioned `<div>`s with their own native
click listeners, no Leaflet marker involved at all) — none confirmed fixed,
because there was no way to actually run the page in a browser and inspect it
during that conversation.

**Your first job is not to guess again — it's to reproduce and observe:**
1. Serve the prototype over a real local dev server (not `file://` — see
   below, this may also matter for the tile-loading 403 that showed up when
   testing via `file://`).
2. Open it in an actual browser with devtools open.
3. Click a pin and read the console. Check for JS errors, check whether the
   click listener fires at all (add a `console.log` if needed), check whether
   `openPanel()` runs and what `document.getElementById('panel')` looks like
   in the Elements panel when it "opens."
4. Only then fix the actual root cause. If it turns out to be something like
   a CSS stacking/pointer-events issue, a bundler/module problem introduced
   during the rewrite, or something else entirely — that's fine, just confirm
   it with the devtools before changing code.

## Suggested project setup

The prototype is intentionally a single dependency-free HTML file so it could
run as a Claude.ai artifact. For real development, restructure it into a
proper small project:

```
npm create vite@latest . -- --template vanilla
```

(Vite gives a real local dev server with hot reload, which avoids `file://`
protocol issues entirely — including likely fixing map tile loading, since
tile providers can be picky about requests with no proper origin/referrer.)

Suggested structure once migrated:

```
/index.html
/src
  main.js          # app bootstrap, screen/flow wiring
  state.js         # game state, clamp/format helpers
  map.js           # Leaflet init, tile layer + fallback, pin overlay, positioning
  locations.js      # LOCATIONS data (see content spec below)
  activities.js     # doActivity(), travel time calc, random outcome resolution
  ui.js            # rendering: stat bar, panel, summary/journal screens
/style.css
```

Keep it plain JS/HTML/CSS (no framework needed) unless you have a strong
reason to reach for one — this app has one screen with a few states, some
DOM updates, and a map. A framework would add more surface area, not less.

### Map library

Currently uses **Leaflet** (via CDN) with **CARTO's Voyager raster tiles**
as the primary source and OpenStreetMap's standard tile server as a silent
fallback (`tileerror` event) if CARTO ever fails. This was chosen after an
earlier attempt with MapLibre GL JS failed with
`AJAXError: Request object could not be cloned` inside the Claude.ai artifact
sandbox — that error is characteristic of MapLibre's Web Worker-based tile
fetching breaking in restricted/sandboxed iframe contexts. In a normal
browser + real dev server, MapLibre GL JS (vector tiles, nicer styling
control, e.g. via OpenFreeMap or MapTiler) may well be worth revisiting now
that you're not fighting a sandboxed iframe. Your call — Leaflet + raster
tiles is simpler and already has working pan/zoom/tile logic in the
prototype; MapLibre is more capable if you want custom map styling later.

Either way: **install the map library via npm, not a CDN `<script>` tag**,
once you're in a bundled project — it's more reliable and lets you pin
versions properly.

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

1. Fix the pin-click bug for real, with a real browser + devtools.
2. Get map tiles loading reliably from a proper dev server / production host
   (should mostly resolve itself once off `file://`).
3. Mobile layout pass — the bottom-sheet panel exists in CSS but hasn't been
   tested on a real device.
4. Persist a finished day (e.g. via `localStorage` or a simple backend) so
   people can compare runs / share a result.
5. A second city (Amsterdam or Delft are natural next picks) — the data
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
