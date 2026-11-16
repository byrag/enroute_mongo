import { OSM_FIELDS } from "./constants";
import { distanceMeters, getCoords } from "../../utils/geo";

const KEYS = OSM_FIELDS.map((f) => f.key);

export const placeKey = (p) => `${p.type}/${p.id}`;

// Normalises a raw OSM tag to "yes" | "limited" | "no" | "unknown".
// Missing data is "unknown" — never assumed to mean "no".
export function getTag(tags, key) {
  const val = tags?.[key];
  if (val === undefined || val === null || val === "") return "unknown";
  if (key === "internet_access") {
    if (["wlan", "yes", "free"].includes(val)) return "yes";
    return val === "no" ? "no" : "unknown";
  }
  if (["yes", "limited", "no"].includes(val)) return val;
  return "yes";
}

export const missingCount = (tags) => KEYS.filter((k) => getTag(tags, k) === "unknown").length;
export const completeness = (tags) => Math.round(((KEYS.length - missingCount(tags)) / KEYS.length) * 100);

// Adds distance / completeness / missing count for display + sorting.
export function enrich(place, center) {
  const c = getCoords(place);
  return {
    ...place,
    key: placeKey(place),
    coords: c,
    distance: c ? distanceMeters(center.lat, center.lon, c.lat, c.lon) : 99999,
    completeness: completeness(place.tags),
    missing: missingCount(place.tags),
  };
}

export function matchesFilters(place, active, mode, includeUnknown) {
  if (!active.length) return true;
  const ok = (key) => {
    const v = getTag(place.tags, key);
    return v === "yes" || v === "limited" || (includeUnknown && v === "unknown");
  };
  return mode === "AND" ? active.every(ok) : active.some(ok);
}

export function sortPlaces(list, sortBy) {
  const by = {
    distance: (a, b) => a.distance - b.distance,
    completeness_desc: (a, b) => b.completeness - a.completeness,
    missing_desc: (a, b) => b.missing - a.missing,
    name_asc: (a, b) => (a.tags.name || "").localeCompare(b.tags.name || ""),
  };
  return [...list].sort(by[sortBy] || by.distance);
}
