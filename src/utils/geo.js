// Great-circle distance in metres (haversine).
export function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// OSM elements can be nodes (lat/lon) or ways/relations (center.lat/lon).
export function getCoords(place) {
  if (place.lat && place.lon) return { lat: +place.lat, lon: +place.lon };
  if (place.center?.lat && place.center?.lon) return { lat: +place.center.lat, lon: +place.center.lon };
  return null;
}
