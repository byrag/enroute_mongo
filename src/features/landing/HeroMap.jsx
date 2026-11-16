import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HERO_ROUTE, MAP_TILES } from "../../config/site";

const pin = (cls, label) =>
  L.divIcon({
    className: "hero-pin-wrap",
    html: `<div class="hero-pin ${cls}"><span class="hero-pin-pulse"></span><span class="hero-pin-dot"></span></div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

// Position `t` (0..1) along a polyline, measured by straight-line length.
function pointAlong(path, t) {
  const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const f = d / lens[i];
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * f, path[i][1] + (path[i + 1][1] - path[i][1]) * f];
    }
    d -= lens[i];
  }
  return path[path.length - 1];
}

// Real OpenStreetMap with an animated demo route. The route is illustrative.
export default function HeroMap() {
  const el = useRef(null);

  useEffect(() => {
    const { from, to, path } = HERO_ROUTE;
    const map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true, zoomControl: false });
    L.tileLayer(MAP_TILES.url, { maxZoom: 19, attribution: MAP_TILES.attribution }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.polyline(path, { color: "#ffffff", weight: 11, opacity: 0.95, lineCap: "round" }).addTo(map);
    L.polyline(path, { color: "#10b981", weight: 5, dashArray: "1 10", lineCap: "round", className: "hero-route" }).addTo(map);

    L.marker(from.coords, { icon: pin("pickup") }).addTo(map)
      .bindTooltip(`<small>PICKUP</small><br><b>${from.name}</b>`, { permanent: true, direction: "right", offset: [18, 0], className: "hero-tip" });
    L.marker(to.coords, { icon: pin("dest") }).addTo(map)
      .bindTooltip(`<small>DESTINATION</small><br><b>${to.name}</b>`, { permanent: true, direction: "left", offset: [-18, 0], className: "hero-tip" });

    const car = L.marker(path[0], {
      icon: L.divIcon({ className: "hero-car-wrap", html: '<div class="hero-car">🚗</div>', iconSize: [30, 30], iconAnchor: [15, 15] }),
      interactive: false,
      zIndexOffset: 500,
    }).addTo(map);

    map.fitBounds(L.latLngBounds(path), { padding: [60, 60] });

    // Drive the car along the route (respects reduced-motion)
    let raf;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      const DURATION = 14000;
      const start = performance.now();
      const tick = (now) => {
        car.setLatLng(pointAlong(path, ((now - start) % DURATION) / DURATION));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(el.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      map.remove();
    };
  }, []);

  return <div ref={el} className="absolute inset-0 rounded-[2.5rem]" role="img" aria-label="Map showing a ride from Koramangala to Electronic City" />;
}
