import { useRef, useState, useEffect } from "react";
import useExplorer from "./useExplorer";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import MapView from "./MapView";
import SearchPanel from "./SearchPanel";
import PlaceCard from "./PlaceCard";
import FixModal from "./FixModal";
import ContributionHub from "./ContributionHub";
import ShortcutsModal from "./ShortcutsModal";

function Stat({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-enroute-50 text-xl">{icon}</div>
      <div>
        <div className="text-xl font-black sm:text-2xl">{value}</div>
        <div className="text-xs font-semibold text-slate-500">{label}</div>
      </div>
    </div>
  );
}

// Live map + place finder. Helps riders pick accessible, comfortable pickup
// and drop-off spots, and lets the community fill in missing OpenStreetMap data.
export default function ExplorerSection({ toast, onUsePlace }) {
  const ex = useExplorer(toast);
  const online = useOnlineStatus();
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  const [hoverKey, setHoverKey] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const [fixing, setFixing] = useState(null);
  const [showKeys, setShowKeys] = useState(false);

  // Pin clicked on the map -> highlight its card briefly
  const selectFromMap = (key) => {
    setSelectedKey(key);
    setTimeout(() => setSelectedKey((k) => (k === key ? null : k)), 2000);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { setFixing(null); setShowKeys(false); return; }
      const t = e.target;
      if (t.matches?.("input, textarea, select") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "/") { e.preventDefault(); inputRef.current?.focus(); }
      else if (e.key.toLowerCase() === "m") mapRef.current?.recenter();
      else if (e.key === "?") setShowKeys((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { stats, results, isLive, center } = ex;

  return (
    <section id="explore" className="bg-white/80 py-16 backdrop-blur-sm lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="reveal mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.25em] text-enroute-600">Explore the Map</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Find the Right Pickup &amp; Drop-off Spot</h2>
          <p className="mt-3 text-slate-600">
            Discover nearby places on OpenStreetMap and filter by wheelchair access, Wi-Fi, seating, sockets,
            air conditioning and restrooms — then help fix missing information.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${online ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              <span className={`h-2 w-2 rounded-full ${online ? "animate-pulse bg-emerald-500" : "bg-amber-500"}`} />
              {online ? "Online" : "Offline"}
            </span>
            <button onClick={() => setShowKeys(true)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600 hover:bg-slate-50">
              ⌨️ Shortcuts
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon="📍" value={stats.total} label="Places found" />
          <Stat icon="✨" value={stats.matched} label="Match filters" />
          <Stat icon="❓" value={`${stats.missingRate}%`} label="Missing data" />
          <Stat icon="📝" value={stats.saved} label="Saved fixes" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <SearchPanel ex={ex} inputRef={inputRef} />

          <div className="min-w-0 space-y-5">
            <div className="overflow-hidden rounded-3xl border border-white shadow-soft">
              <MapView
                ref={mapRef}
                center={center}
                radius={ex.form.radius}
                places={results}
                activeKey={hoverKey || selectedKey}
                onFix={setFixing}
                onSelect={selectFromMap}
              />
            </div>

            <div>
              <h3 className="font-black">Found {stats.matched} of {stats.total} places matching your criteria</h3>
              <p className="text-xs text-slate-500">
                {isLive
                  ? <>Live OpenStreetMap results around <b>{center.label}</b>.</>
                  : <span className="font-bold text-amber-600">⚠️ Demo dataset shown — run a search to load live data.</span>}
              </p>
            </div>

            {ex.loading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />)}
              </div>
            ) : results.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {results.map((p) => (
                  <PlaceCard
                    key={p.key}
                    place={p}
                    selected={selectedKey === p.key}
                    onHover={setHoverKey}
                    onCenter={(pl) => mapRef.current?.flyTo(pl)}
                    onFix={setFixing}
                    onUse={onUsePlace}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center">
                <div className="mb-2 text-3xl">🔍</div>
                <h4 className="text-sm font-black">No places matched the current filters</h4>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
                  Try including unverified tags, widening the radius, or switching to “Match ANY (OR)”.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ContributionHub contributions={ex.contributions} onClear={ex.clearContributions} toast={toast} />
        </div>
      </div>

      {fixing && <FixModal place={fixing} onClose={() => setFixing(null)} onSave={ex.saveContribution} />}
      {showKeys && <ShortcutsModal onClose={() => setShowKeys(false)} />}
    </section>
  );
}
