import { copyText } from "../../utils/webApis";
import { downloadBlob } from "../../utils/download";

const btn = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50";
const stamp = () => new Date().toISOString().slice(0, 10);

function toGeoJson(items) {
  return {
    type: "FeatureCollection",
    generator: "Enroute Explorer",
    features: items.map((c) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: c.coordinates ? [c.coordinates.lon, c.coordinates.lat] : [0, 0] },
      properties: {
        osmId: c.osmId, name: c.name, amenity: c.amenity,
        suggestedTags: c.suggestedTags, contributorNote: c.note, timestamp: c.timestamp,
      },
    })),
  };
}

export default function ContributionHub({ contributions, onClear, toast }) {
  const json = JSON.stringify(contributions, null, 2);
  const guard = (fn) => () => (contributions.length ? fn() : toast("No saved contributions yet."));

  const copy = guard(async () => {
    const ok = await copyText(json).catch(() => false);
    toast(ok ? "JSON copied to clipboard." : "Could not copy to clipboard.");
  });
  const download = guard(() => {
    downloadBlob(json, `enroute-fixes-${stamp()}.json`);
    toast("Downloaded JSON file.");
  });
  const exportGeo = guard(() => {
    downloadBlob(JSON.stringify(toGeoJson(contributions), null, 2), `enroute-fixes-${stamp()}.geojson`, "application/geo+json");
    toast("Exported GeoJSON.");
  });
  const clear = guard(() => {
    if (window.confirm("Clear all saved contributions?")) onClear();
  });

  return (
    <div id="contributions" className="rounded-3xl border border-white bg-white/95 p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-black">Community Contribution Hub</h3>
          <p className="text-xs text-slate-500">
            Fixes you record are stored in this browser. They are not uploaded to OpenStreetMap automatically.
          </p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
          {contributions.length} pending fix{contributions.length === 1 ? "" : "es"}
        </span>
      </div>

      <pre className="mt-3 max-h-56 overflow-auto rounded-2xl bg-slate-950 p-4 text-[11px] leading-5 text-emerald-300">
        {contributions.length ? json : "// No contributions yet. Click “Fix” on a place to add one."}
      </pre>

      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={copy} className={btn}>📋 Copy JSON</button>
        <button onClick={download} className={btn}>⬇️ Download JSON</button>
        <button onClick={exportGeo} className={btn}>🌍 Export GeoJSON</button>
        <button onClick={clear} className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50">🗑 Clear</button>
      </div>
    </div>
  );
}
