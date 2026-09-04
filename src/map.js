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

let map = null;
let markers = {};
let playerMarker = null;

export function initMap({ onSelect }) {
  map = new MapLibreMap({
    container: 'map',
    style: STYLE_URL,
    center: [START.lng, START.lat],
    zoom: DEFAULT_ZOOM,
    attributionControl: { compact: true },
  });
  map.addControl(new NavigationControl({ showCompass: false }), 'top-left');

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
