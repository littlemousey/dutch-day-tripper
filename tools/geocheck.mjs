// Coordinate audit: geocodes every location against OpenStreetMap and prints how
// far the pin is from the real thing.
//
//     node tools/geocheck.mjs
//
// Travel times in this game are computed from these coordinates, so a pin in the
// wrong place quietly makes the whole day wrong — the Spoorwegmuseum was once
// 1.5km out. Anything over ~150m wants looking at; squares and parks legitimately
// differ from their centroid by a bit. Nominatim asks for one request a second,
// hence the sleep. Needs network access.

const { LOCATIONS } = await import(new URL('../src/locations.js', import.meta.url).href);

// What to ask the geocoder for each pin — the in-game names are colloquial.
const QUERIES = {
  centraal: 'Utrecht Centraal station',
  dom: 'Domplein, Utrecht',
  pieterskerk: 'Pieterskerk, Pieterskerkhof, Utrecht',
  speelklok: 'Museum Speelklok, Steenweg, Utrecht',
  hema: 'HEMA, Steenweg, Utrecht',
  sonnenborgh: 'Sterrenwacht Sonnenborgh, Zonnenburg, Utrecht',
  academie: 'Academiegebouw, Domplein, Utrecht',
  oudegracht: 'Oudegracht, Utrecht',
  muntkelder: 'Oude Muntkelder, Oudegracht, Utrecht',
  mario: 'Broodje Mario, Oudegracht, Utrecht',
  museum: 'Centraal Museum, Utrecht',
  cinema: 'Louis Hartlooper Complex, Utrecht',
  miffy: 'nijntje museum, Agnietenstraat, Utrecht',
  rietveld: 'Rietveld Schröderhuis, Utrecht',
  wilhelminapark: 'Wilhelminapark, Utrecht',
  nijntjepleintje: 'Nijntje Pleintje, Utrecht',
  vredenburg: 'Vredenburg, Utrecht',
  lombok: 'Kanaalstraat, Lombok, Utrecht',
  jaarbeurs: 'Jaarbeursplein, Utrecht', // the pin is the visitor entrance by the station, not the hall centroid
  oogindal: "'s Rijks Munt, Leidseweg, Utrecht", // pinned at the Mint; the park is a few minutes further west
  winkel: 'Winkel van Sinkel, Oudegracht, Utrecht',
  railway: 'Spoorwegmuseum, Utrecht',
  neude: 'Neude, Utrecht',
  campus: 'Educatorium, Utrecht Science Park',
  botanic: 'Botanische Tuinen Utrecht',
  muntkelder: 'Oudegracht 112, Utrecht',
  cinema: 'Tolsteegbrug 1, Utrecht',
  tivoli: 'TivoliVredenburg, Utrecht',
  schouwburg: 'Stadsschouwburg, Lucasbolwerk, Utrecht',
};

const R = 6371000, rad = (d) => (d * Math.PI) / 180;
const dist = (a, b) => {
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat/2)**2 + Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const rows = [];
for (const loc of LOCATIONS) {
  const q = QUERIES[loc.id];
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=nl`;
  const res = await fetch(url, { headers: { 'User-Agent': 'dutch-day-tripper-dev/1.0 (coordinate check)' } });
  const [hit] = await res.json();
  if (!hit) { rows.push({ id: loc.id, off: null, q }); await sleep(1100); continue; }
  const real = { lat: +hit.lat, lng: +hit.lon };
  rows.push({ id: loc.id, name: loc.name, off: dist(loc, real), have: [loc.lat, loc.lng], real: [+real.lat.toFixed(4), +real.lng.toFixed(4)], osm: hit.display_name.split(',').slice(0,3).join(',') });
  await sleep(1100);
}
rows.sort((a, b) => (b.off ?? -1) - (a.off ?? -1));
for (const r of rows) {
  if (r.off === null) { console.log('   ??  ' + r.id + '  (no geocoder hit for "' + r.q + '")'); continue; }
  const flag = r.off > 400 ? 'WRONG' : r.off > 150 ? 'check' : 'ok';
  console.log(String(r.off).padStart(5) + 'm  ' + flag.padEnd(6) + r.id.padEnd(16) + 'have ' + r.have.join(',') + '   osm ' + r.real.join(',') + '   ' + r.osm);
}
