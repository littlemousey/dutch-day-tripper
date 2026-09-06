import { Map as MapLibreMap, LngLatBounds, Marker, NavigationControl, config } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

import { LOCATIONS, START, CAT_COLORS, findLocation } from './locations.js';
import { state } from './state.js';
import { isLocationExhausted } from './activities.js';

// MapLibre otherwise locates its Web Worker relative to import.meta.url, which
// points into the bundle — where no worker file exists. The worker then 404s
// and the map renders nothing at all, with no error. Hand it a URL the bundler
// actually emits. `?worker&url` (not plain `?url`) matters: the worker imports
// maplibre-gl-shared.mjs, so it has to be bundled, not just copied.
config.WORKER_URL = maplibreWorkerUrl;

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
// MapLibre serves 512px tiles, so a given zoom covers half the ground Leaflet's
// 256px tiles did at the same number: 13.3 here frames the city like the
// prototype's 14.3 did.
const DEFAULT_ZOOM = 13.3;
const FIT_PADDING = 48;
// Domplein — what the view falls back to when the window is too narrow to hold
// the whole set of locations.
const CENTRE_ANCHOR = [5.1215, 52.0908];

function locationBounds() {
  const bounds = new LngLatBounds();
  for (const loc of LOCATIONS) bounds.extend([loc.lng, loc.lat]);
  return bounds;
}

// The Science Park locations sit ~4.5km east of the station, so a plain fit to
// all the pins zooms out far enough that the dozen centre ones collapse into a
// single cluster badge — useless on a phone. The zoom therefore stays put and
// only the centring adapts: show everything when the viewport is wide enough to
// hold it at this zoom, otherwise frame the old city centre and let the player
// pan east.
function cityView() {
  const cam = map.cameraForBounds(locationBounds(), { padding: FIT_PADDING, maxZoom: DEFAULT_ZOOM });
  const fitsOnScreen = cam && cam.zoom >= DEFAULT_ZOOM - 1e-6;
  return { center: fitsOnScreen ? cam.center : CENTRE_ANCHOR, zoom: DEFAULT_ZOOM };
}

// The visible tip of a .pin sits 24px below the element's centre: the pin is a
// 34px square rotated -45deg, so its sharp corner lands at the bottom of a
// 48px bounding box. Offsetting by that puts the tip on the real coordinate.
const PIN_TIP_OFFSET = [0, -24];

// A pin under the open panel may as well not be on screen. Both helpers below
// read the panel's *layout* box — offsetLeft/offsetTop, not
// getBoundingClientRect: the rect is mid-transition the instant .open is set
// and would report the sheet still off the bottom of the screen.
// Which edge the panel covers is read from that box too rather than from a
// duplicated breakpoint: full width means the phone's bottom sheet, anything
// narrower means the desktop side panel.
function panelCover() {
  const panel = document.getElementById('panel');
  if (!panel || !panel.classList.contains('open')) return null;
  const container = map.getContainer();
  return {
    isSheet: panel.offsetWidth >= container.clientWidth - 1,
    left: panel.offsetLeft,
    top: panel.offsetTop,
    width: panel.offsetWidth,
  };
}

// Centres a point in the strip of map the panel leaves visible instead of in
// the middle of the container, half of which may be covered.
function visibleCentreOffset() {
  const cover = panelCover();
  if (!cover) return [0, 0];
  return cover.isSheet
    ? [0, -(map.getContainer().clientHeight - cover.top) / 2]
    : [-cover.width / 2, 0];
}

// Clearance for the pin's own body (34px tall, drawn above its coordinate)
// plus a little air, so the pin lands fully clear of the panel edge.
const REVEAL_MARGIN = 56;

// Nudges the camera the minimum distance needed to bring a point out from
// under the panel — and does nothing at all when it was never covered.
function revealBehindPanel(lngLat) {
  const cover = panelCover();
  if (!cover) return;
  const pt = map.project(lngLat);
  const dx = cover.isSheet ? 0 : Math.max(0, pt.x - (cover.left - REVEAL_MARGIN));
  const dy = cover.isSheet ? Math.max(0, pt.y - (cover.top - REVEAL_MARGIN)) : 0;
  if (!dx && !dy) return;
  map.panBy([dx, dy], { duration: 450 });
}

// The stock positron style is neutral grey. These overrides pull the basemap
// into the game's palette: warm paper for land, sandstone buildings, muted
// canal-green water (Utrecht being a canal city). Everything stays low
// saturation on purpose, so the category-coloured pins remain the most
// saturated thing on screen and stay readable against it.
// Delete the applyPaletteTint() call in initMap to go back to stock positron.
const PALETTE_TINT = {
  background: { 'background-color': '#F6F1E7' },
  landuse_residential: { 'fill-color': '#F1E9D9' },
  park: { 'fill-color': '#E2E4CF' },
  landcover_wood: { 'fill-color': '#DADEC6' },
  water: { 'fill-color': '#9FBAB2' },
  waterway: { 'line-color': '#8CAAA1' },
  building: { 'fill-color': '#EADFC8', 'fill-outline-color': '#DDCFB2' },

  highway_path: { 'line-color': '#E8E0CE' },
  highway_minor: { 'line-color': '#EFE7D6' },
  highway_major_casing: { 'line-color': '#DCD1B8' },
  highway_major_inner: { 'line-color': '#FFFBF2' },
  highway_major_subtle: { 'line-color': '#E4DBC6' },
  highway_motorway_casing: { 'line-color': '#D8CCB0' },
  highway_motorway_inner: { 'line-color': '#FFFBF2' },
  highway_motorway_subtle: { 'line-color': '#E4DBC6' },
  road_area_pier: { 'fill-color': '#F1E9D9' },
  road_pier: { 'line-color': '#F1E9D9' },

  railway: { 'line-color': '#D9CFB8' },
  railway_dashline: { 'line-color': '#F6F1E7' },
  railway_transit: { 'line-color': '#D9CFB8' },
  railway_transit_dashline: { 'line-color': '#F6F1E7' },
  railway_service: { 'line-color': '#D9CFB8' },
  railway_service_dashline: { 'line-color': '#F6F1E7' },

  waterway_line_label: { 'text-color': '#6E8880', 'text-halo-color': 'rgba(246,241,231,0.8)' },
  water_name_point_label: { 'text-color': '#3A5A52', 'text-halo-color': 'rgba(246,241,231,0.8)' },
  water_name_line_label: { 'text-color': '#3A5A52', 'text-halo-color': 'rgba(246,241,231,0.8)' },
  'highway-name-path': { 'text-color': '#8A8072', 'text-halo-color': '#F6F1E7' },
  'highway-name-minor': { 'text-color': '#8A8072' },
  'highway-name-major': { 'text-color': '#7A7060' },
  label_other: { 'text-color': '#5B5245', 'text-halo-color': '#F6F1E7' },
  label_village: { 'text-color': '#4A4236', 'text-halo-color': '#F6F1E7' },
  label_town: { 'text-color': '#3A342B', 'text-halo-color': '#F6F1E7' },
  label_city: { 'text-color': '#201C18', 'text-halo-color': '#F6F1E7' },
};



// Utrecht's centre packs several locations into a couple of hundred metres, so
// at the starting zoom their pins overlap and the buried ones can't be clicked.
// A clustered GeoJSON source groups them into a single counted badge; clicking
// it zooms to the level where they separate. Pins stay as DOM markers rather
// than map layers so they keep the teardrop-and-emoji design, with this source
// acting purely as the clustering engine we query on each move.
const CLUSTER_MAX_ZOOM = 16;
const CLUSTER_RADIUS = 44;
const SOURCE_ID = 'locations';

let map = null;
let playerMarker = null;
let onSelectLocation = () => {};
const locationMarkers = new Map();
const clusterMarkers = new Map();

// The style is fetched from OpenFreeMap, so a layer named here may not exist
// in a future version of it; skip rather than throw.
function applyPaletteTint(m) {
  for (const [layerId, paint] of Object.entries(PALETTE_TINT)) {
    if (!m.getLayer(layerId)) continue;
    for (const [prop, value] of Object.entries(paint)) {
      m.setPaintProperty(layerId, prop, value);
    }
  }
}

function locationsGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: LOCATIONS.map((loc) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [loc.lng, loc.lat] },
      properties: { id: loc.id, done: isLocationExhausted(loc) },
    })),
  };
}

function makePinElement(loc) {
  // MapLibre writes its own `transform` onto the marker element to position it,
  // which would clobber the pin's rotate(-45deg). Keep the rotation on an inner
  // element and hand MapLibre a plain wrapper.
  const wrapper = document.createElement('div');
  wrapper.className = 'pin-marker';

  const pin = document.createElement('div');
  pin.className = 'pin';
  pin.style.background = CAT_COLORS[loc.cat];
  pin.innerHTML = '<span>' + loc.icon + '</span>';
  pin.classList.toggle('visited', isLocationExhausted(loc));
  wrapper.appendChild(pin);

  wrapper.addEventListener('click', (ev) => {
    ev.stopPropagation();
    onSelectLocation(loc.id);
    // The panel is open by now, so this can measure what it actually covers.
    revealBehindPanel([loc.lng, loc.lat]);
  });
  return wrapper;
}

function makeClusterElement(clusterId, count, allDone) {
  const el = document.createElement('div');
  el.className = 'cluster-marker' + (allDone ? ' visited' : '');
  el.textContent = String(count);
  el.title = `${count} places here — click to zoom in`;

  el.addEventListener('click', async (ev) => {
    ev.stopPropagation();
    const source = map.getSource(SOURCE_ID);
    const marker = clusterMarkers.get(clusterId);
    if (!source || !marker) return;
    // A little past the break-apart zoom, so they visibly separate.
    const zoom = (await source.getClusterExpansionZoom(clusterId)) + 0.3;
    map.easeTo({
      center: marker.getLngLat(),
      zoom,
      offset: visibleCentreOffset(),
      duration: 700,
    });
  });
  return el;
}

// Rebuilds the marker set from whatever the clustered source currently holds.
// Markers are keyed so unchanged ones are left alone and don't flicker.
function syncMarkers() {
  if (!map.getSource(SOURCE_ID) || !map.isSourceLoaded(SOURCE_ID)) return;

  const features = map.querySourceFeatures(SOURCE_ID);
  const liveClusters = new Set();
  const liveLocations = new Set();

  for (const f of features) {
    const props = f.properties;
    const [lng, lat] = f.geometry.coordinates;

    if (props.cluster) {
      const clusterId = props.cluster_id;
      // The same cluster can come back from several tiles.
      if (liveClusters.has(clusterId)) continue;
      liveClusters.add(clusterId);

      const allDone = props.doneCount === props.point_count;
      const existing = clusterMarkers.get(clusterId);
      if (existing) {
        existing.getElement().classList.toggle('visited', allDone);
      } else {
        const el = makeClusterElement(clusterId, props.point_count, allDone);
        clusterMarkers.set(clusterId, new Marker({ element: el }).setLngLat([lng, lat]).addTo(map));
      }
    } else {
      const loc = findLocation(props.id);
      if (!loc || liveLocations.has(loc.id)) continue;
      liveLocations.add(loc.id);

      const existing = locationMarkers.get(loc.id);
      if (existing) {
        existing.getElement().querySelector('.pin').classList.toggle('visited', isLocationExhausted(loc));
      } else {
        const marker = new Marker({ element: makePinElement(loc), offset: PIN_TIP_OFFSET })
          .setLngLat([lng, lat])
          .addTo(map);
        locationMarkers.set(loc.id, marker);
      }
    }
  }

  for (const [id, marker] of clusterMarkers) {
    if (!liveClusters.has(id)) {
      marker.remove();
      clusterMarkers.delete(id);
    }
  }
  for (const [id, marker] of locationMarkers) {
    if (!liveLocations.has(id)) {
      marker.remove();
      locationMarkers.delete(id);
    }
  }
}

export function initMap({ onSelect }) {
  onSelectLocation = onSelect;

  map = new MapLibreMap({
    container: 'map',
    style: STYLE_URL,
    center: CENTRE_ANCHOR,
    zoom: DEFAULT_ZOOM,
    attributionControl: { compact: true },
  });
  map.jumpTo(cityView());
  map.addControl(new NavigationControl({ showCompass: false }), 'top-left');

  map.on('load', () => {
    applyPaletteTint(map);

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: locationsGeoJSON(),
      cluster: true,
      clusterMaxZoom: CLUSTER_MAX_ZOOM,
      clusterRadius: CLUSTER_RADIUS,
      // Lets a cluster tell whether every location inside it is finished.
      clusterProperties: { doneCount: ['+', ['case', ['get', 'done'], 1, 0]] },
    });

    // querySourceFeatures only returns features from tiles the map has actually
    // built, and it only builds tiles for sources some layer references. This
    // layer draws nothing; it exists so the clustered tiles get computed.
    map.addLayer({
      id: 'locations-anchor',
      type: 'circle',
      source: SOURCE_ID,
      paint: { 'circle-radius': 0, 'circle-opacity': 0 },
    });

    syncMarkers();
  });

  map.on('moveend', syncMarkers);
  map.on('sourcedata', (e) => {
    if (e.sourceId === SOURCE_ID && e.isSourceLoaded) syncMarkers();
  });

  const dot = document.createElement('div');
  dot.className = 'player-dot';
  playerMarker = new Marker({ element: dot }).setLngLat([START.lng, START.lat]).addTo(map);

  return map;
}

export function updatePlayerMarker() {
  const loc = findLocation(state.currentLoc);
  playerMarker.setLngLat([loc.lng, loc.lat]);
  map.flyTo({ center: [loc.lng, loc.lat], offset: visibleCentreOffset(), duration: 900 });
}

// Completing an activity can exhaust a location, which changes both the pin's
// own styling and the done-tally its cluster reports, so the source data is
// refreshed rather than just the DOM.
export function refreshPinStyles() {
  const source = map.getSource(SOURCE_ID);
  if (source) source.setData(locationsGeoJSON());
  syncMarkers();
}

export function resetMapView() {
  playerMarker.setLngLat([START.lng, START.lat]);
  map.flyTo({ ...cityView(), duration: 600 });
  refreshPinStyles();
}

export function mapExists() {
  return map !== null;
}
