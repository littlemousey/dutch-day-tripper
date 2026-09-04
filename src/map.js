import { Map as MapLibreMap, Marker, NavigationControl, config } from 'maplibre-gl';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

// MapLibre otherwise locates its Web Worker relative to import.meta.url, which
// points into the bundle — where no worker file exists. The worker then 404s
// and the map renders nothing at all, with no error. Hand it a URL the bundler
// actually emits. `?worker&url` (not plain `?url`) matters: the worker imports
// maplibre-gl-shared.mjs, so it has to be bundled, not just copied.
config.WORKER_URL = maplibreWorkerUrl;
import { LOCATIONS, START, CAT_COLORS, findLocation } from './locations.js';
import { state } from './state.js';
import { isLocationExhausted } from './activities.js';

const STYLE_URL = 'https://tiles.openfreemap.org/styles/positron';
// MapLibre serves 512px tiles, so a given zoom covers half the ground Leaflet's
// 256px tiles did at the same number: 13.3 here frames the city like the
// prototype's 14.3, keeping every pin on screen.
const DEFAULT_ZOOM = 13.3;

// The visible tip of a .pin sits 24px below the element's centre: the pin is a
// 34px square rotated -45deg, so its sharp corner lands at the bottom of a
// 48px bounding box. Offsetting by that puts the tip on the real coordinate.
const PIN_TIP_OFFSET = [0, -24];

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

let map = null;
let markers = {};
let playerMarker = null;

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

export function initMap({ onSelect }) {
  map = new MapLibreMap({
    container: 'map',
    style: STYLE_URL,
    center: [START.lng, START.lat],
    zoom: DEFAULT_ZOOM,
    attributionControl: { compact: true },
  });
  map.addControl(new NavigationControl({ showCompass: false }), 'top-left');
  map.on('load', () => applyPaletteTint(map));

  LOCATIONS.forEach((loc) => {
    // MapLibre writes its own `transform` onto the marker element to position
    // it, which would clobber the pin's rotate(-45deg). Keep the rotation on an
    // inner element and hand MapLibre a plain wrapper.
    const wrapper = document.createElement('div');
    wrapper.className = 'pin-marker';

    const pin = document.createElement('div');
    pin.className = 'pin';
    pin.style.background = CAT_COLORS[loc.cat];
    pin.innerHTML = '<span>' + loc.icon + '</span>';
    wrapper.appendChild(pin);

    wrapper.addEventListener('click', (ev) => {
      ev.stopPropagation();
      onSelect(loc.id);
    });

    markers[loc.id] = new Marker({ element: wrapper, offset: PIN_TIP_OFFSET })
      .setLngLat([loc.lng, loc.lat])
      .addTo(map);
  });

  const dot = document.createElement('div');
  dot.className = 'player-dot';
  playerMarker = new Marker({ element: dot })
    .setLngLat([START.lng, START.lat])
    .addTo(map);

  return map;
}

export function updatePlayerMarker() {
  const loc = findLocation(state.currentLoc);
  playerMarker.setLngLat([loc.lng, loc.lat]);
  map.flyTo({ center: [loc.lng, loc.lat], duration: 900 });
}

export function refreshPinStyles() {
  LOCATIONS.forEach((loc) => {
    const el = markers[loc.id]?.getElement().querySelector('.pin');
    if (el) el.classList.toggle('visited', isLocationExhausted(loc));
  });
}

export function resetMapView() {
  playerMarker.setLngLat([START.lng, START.lat]);
  map.flyTo({ center: [START.lng, START.lat], zoom: DEFAULT_ZOOM, duration: 600 });
  refreshPinStyles();
}

export function mapExists() {
  return map !== null;
}
