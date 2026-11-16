// OpenStreetMap services: Nominatim (geocoding) + Overpass (place queries).
// All calls accept an AbortSignal so a new search can cancel the old one.

const NOMINATIM = "https://nominatim.openstreetmap.org";
const OVERPASS = "https://overpass-api.de/api/interpreter";

export async function geocode(query, signal) {
  const res = await fetch(`${NOMINATIM}/search?format=json&limit=1&q=${encodeURIComponent(query)}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Nominatim error: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) throw new Error("Location not found on OpenStreetMap");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), displayName: data[0].display_name };
}

export async function reverseGeocode(lat, lon) {
  const res = await fetch(`${NOMINATIM}/reverse?format=json&lat=${lat}&lon=${lon}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Reverse geocoding failed");
  const data = await res.json();
  const a = data.address;
  return a ? a.suburb || a.neighbourhood || a.city || data.display_name.split(",")[0] : "Current location";
}

export async function fetchPlaces({ lat, lon, radius, category }, signal) {
  const query = `[out:json][timeout:12];(nwr["amenity"="${category}"]["name"](around:${radius},${lat},${lon}););out center tags 50;`;
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "data=" + encodeURIComponent(query),
    signal,
  });
  if (!res.ok) throw new Error(`Overpass API responded with HTTP ${res.status}`);
  return res.json();
}
