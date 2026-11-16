import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_TILES } from "../../config/site";

// Interactive OpenStreetMap (Leaflet). Pins are green when every tag is known,
// amber (with the missing-tag count) otherwise.
const MapView = forwardRef(function MapView({ center, radius, places, activeKey, onFix, onSelect }, ref) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const circle = useRef(null);
  const pins = useRef(new Map());
  const callbacks = useRef({ onFix, onSelect });
  const active = useRef(activeKey);
  callbacks.current = { onFix, onSelect };
  active.current = activeKey;

  // Create the map once
  useEffect(() => {
    const m = L.map(el.current).setView([center.lat, center.lon], 15);
    L.tileLayer(MAP_TILES.url, { maxZoom: 19, attribution: MAP_TILES.attribution }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    circle.current = L.circle([center.lat, center.lon], {
      radius, color: "#10b981", weight: 1.5, fillColor: "#10b981", fillOpacity: 0.08,
    }).addTo(m);
    map.current = m;

    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the search centre and radius
  useEffect(() => {
    if (!map.current) return;
    map.current.setView([center.lat, center.lon], 15);
    circle.current.setLatLng([center.lat, center.lon]);
    circle.current.setRadius(radius);
  }, [center, radius]);

  // Rebuild the pins when the visible places change
  useEffect(() => {
    if (!map.current) return;
    layer.current.clearLayers();
    pins.current.clear();

    places.forEach((p) => {
      if (!p.coords) return;
      const complete = p.missing === 0;
      const icon = L.divIcon({
        className: "fit-pin-wrap",
        html: `<div class="fit-pin ${complete ? "complete" : "partial"} ${p.key === active.current ? "active-pin" : ""}">${complete ? "✓" : p.missing}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      const popup = document.createElement("div");
      popup.className = "fit-popup";
      const title = document.createElement("strong");
      title.textContent = p.tags.name;
      const sub = document.createElement("div");
      sub.textContent = `${p.tags.amenity || "Place"} • ${p.missing ? `${p.missing} tags missing` : "all tags known"}`;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = p.missing ? "Improve missing tags" : "Suggest edit";
      btn.onclick = () => callbacks.current.onFix(p);
      popup.append(title, sub, btn);

      const marker = L.marker([p.coords.lat, p.coords.lon], { icon }).bindPopup(popup);
      marker.on("click", () => callbacks.current.onSelect(p.key));
      layer.current.addLayer(marker);
      pins.current.set(p.key, marker);
    });
  }, [places]);

  // Highlight the active pin
  useEffect(() => {
    pins.current.forEach((marker, key) => {
      marker.getElement()?.querySelector(".fit-pin")?.classList.toggle("active-pin", key === activeKey);
    });
  }, [activeKey]);

  useImperativeHandle(ref, () => ({
    flyTo(place) {
      if (!map.current || !place.coords) return;
      map.current.flyTo([place.coords.lat, place.coords.lon], 17, { duration: 1.2 });
      pins.current.get(place.key)?.openPopup();
    },
    recenter() {
      map.current?.setView([center.lat, center.lon], 15);
    },
  }));

  return <div ref={el} className="h-[420px] w-full rounded-3xl lg:h-[480px]" role="application" aria-label="Map of nearby places" />;
});

export default MapView;
