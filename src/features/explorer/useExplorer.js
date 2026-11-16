import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { geocode, reverseGeocode, fetchPlaces } from "../../api/osm";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getCoords } from "../../utils/geo";
import { DEFAULT_CENTER, DEFAULT_FORM, SAMPLE_PLACES, OSM_FIELDS } from "./constants";
import { enrich, matchesFilters, sortPlaces, missingCount, placeKey } from "./tags";

const cloneSample = (category) =>
  JSON.parse(JSON.stringify(SAMPLE_PLACES)).map((p) => ({ ...p, demo: true, tags: { ...p.tags, amenity: category } }));

// All explorer state + actions live here so the components stay presentational.
export default function useExplorer(toast) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState("");
  const [filters, setFilters] = useState([]);
  const [matchMode, setMatchMode] = useState("AND");
  const [includeUnknown, setIncludeUnknown] = useState(true);
  const [sortBy, setSortBy] = useState("distance");

  const [places, setPlaces] = useState(() => cloneSample(DEFAULT_FORM.category));
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [isLive, setIsLive] = useState(false); // starts on the demo dataset
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useLocalStorage("enroute-contributions", []);

  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const updateForm = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleFilter = (key) =>
    setFilters((f) => (f.includes(key) ? f.filter((k) => k !== key) : [...f, key]));

  // ---- Search (Nominatim -> Overpass, with offline demo fallback) ----
  const search = useCallback(
    async ({ query = form.query, coords = null } = {}) => {
      const q = query.trim();
      if (q.length < 3) {
        setFormError("Enter at least 3 characters.");
        return;
      }
      setFormError("");
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const timeout = setTimeout(() => ctrl.abort(), 12000);
      setLoading(true);

      try {
        const pos = coords || (await geocode(q, ctrl.signal));
        setCenter({ lat: pos.lat, lon: pos.lon, label: q });
        const data = await fetchPlaces({ lat: pos.lat, lon: pos.lon, radius: form.radius, category: form.category }, ctrl.signal);
        const found = (data.elements || []).filter((e) => e.tags?.name);
        if (!found.length) throw new Error("No places found in this radius. Try widening it.");
        setPlaces(found);
        setIsLive(true);
        toast(`Loaded ${found.length} live OpenStreetMap places`);
      } catch (err) {
        if (abortRef.current !== ctrl) return; // superseded by a newer search
        setPlaces(cloneSample(form.category));
        setCenter({ ...DEFAULT_CENTER, label: "Indiranagar, Bengaluru (demo)" });
        setIsLive(false);
        toast(err.name === "AbortError" ? "Network timeout. Showing demo data." : `${err.message} Showing demo data.`);
      } finally {
        clearTimeout(timeout);
        if (abortRef.current === ctrl) setLoading(false);
      }
    },
    [form.query, form.radius, form.category, toast]
  );

  // ---- Geolocation API ----
  const locateMe = () => {
    if (!("geolocation" in navigator)) return toast("Geolocation is not supported by this browser.");
    toast("Acquiring your location…");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const pos = { lat: coords.latitude, lon: coords.longitude };
        let label;
        try {
          label = await reverseGeocode(pos.lat, pos.lon);
        } catch {
          label = `${pos.lat.toFixed(4)}, ${pos.lon.toFixed(4)}`;
        }
        updateForm({ query: label });
        search({ query: label, coords: pos });
      },
      (err) => toast(`Location error: ${err.message}`),
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const loadSample = () => {
    abortRef.current?.abort();
    setPlaces(cloneSample(form.category));
    setCenter(DEFAULT_CENTER);
    setIsLive(false);
    setLoading(false);
    toast("Demo dataset loaded.");
  };

  const resetFilters = () => {
    setFilters([]);
    setMatchMode("AND");
    setIncludeUnknown(true);
    setSortBy("distance");
    setForm(DEFAULT_FORM);
    setFormError("");
  };

  // ---- Derived results ----
  const results = useMemo(() => {
    const enriched = places.map((p) => enrich(p, center));
    return sortPlaces(enriched.filter((p) => matchesFilters(p, filters, matchMode, includeUnknown)), sortBy);
  }, [places, center, filters, matchMode, includeUnknown, sortBy]);

  const stats = useMemo(() => {
    const possible = places.length * OSM_FIELDS.length;
    const missing = places.reduce((n, p) => n + missingCount(p.tags), 0);
    return {
      total: places.length,
      matched: results.length,
      missingRate: possible ? Math.round((missing / possible) * 100) : 0,
      saved: contributions.length,
    };
  }, [places, results, contributions]);

  // ---- Community contributions (kept in this browser only) ----
  const saveContribution = (place, suggestedTags, note) => {
    const c = {
      id: `fix-${Date.now()}`,
      osmId: placeKey(place),
      name: place.tags.name,
      amenity: place.tags.amenity || "unknown",
      coordinates: getCoords(place),
      suggestedTags,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };
    setContributions((list) => [c, ...list]);
    // Apply instantly so the card/pin update
    setPlaces((list) => list.map((p) => (placeKey(p) === placeKey(place) ? { ...p, tags: { ...p.tags, ...suggestedTags } } : p)));
    toast(`Saved contribution for "${c.name}"`);
  };

  const clearContributions = () => {
    setContributions([]);
    toast("Saved contributions cleared.");
  };

  return {
    form, updateForm, formError,
    filters, toggleFilter, matchMode, setMatchMode, includeUnknown, setIncludeUnknown, sortBy, setSortBy,
    places, results, stats, center, isLive, loading,
    search, locateMe, loadSample, resetFilters,
    contributions, saveContribution, clearContributions,
  };
}
