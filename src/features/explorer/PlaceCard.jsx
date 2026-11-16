import { useEffect, useRef } from "react";
import { OSM_FIELDS } from "./constants";
import { getTag } from "./tags";

const BADGE = {
  yes: { text: "Yes", cls: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  limited: { text: "Partial", cls: "bg-blue-100 text-blue-800 border border-blue-200" },
  no: { text: "No", cls: "bg-rose-100 text-rose-800 border border-rose-200" },
  unknown: { text: "Unknown", cls: "bg-amber-50 text-amber-800 border border-dashed border-amber-300" },
};

export default function PlaceCard({ place, selected, onHover, onCenter, onFix, onUse }) {
  const ref = useRef(null);
  const complete = place.completeness === 100;

  useEffect(() => {
    if (selected) ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  return (
    <article
      ref={ref}
      onMouseEnter={() => onHover(place.key)}
      onMouseLeave={() => onHover(null)}
      className={`flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition hover:border-enroute-400 hover:shadow-md ${
        selected ? "border-enroute-500 ring-2 ring-enroute-500" : "border-slate-200"
      }`}
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-sm font-black sm:text-base">{place.tags.name}</h4>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold capitalize">{(place.tags.amenity || "place").replace("_", " ")}</span>
              <span>•</span>
              <span className="font-mono text-[11px]">{place.distance}m away</span>
            </div>
          </div>
          {!place.demo && (
            <a
              href={`https://www.openstreetmap.org/${place.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-[11px] font-bold text-enroute-700 hover:underline"
              title="Inspect on OpenStreetMap"
            >
              OSM ↗
            </a>
          )}
        </div>

        <div>
          <div className="mb-1 flex justify-between text-[10px] text-slate-500">
            <span>Tag completeness</span>
            <span className={`font-black ${complete ? "text-emerald-600" : "text-amber-600"}`}>{place.completeness}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-emerald-500" : "bg-gradient-to-r from-amber-500 to-emerald-500"}`}
              style={{ width: `${place.completeness}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {OSM_FIELDS.map((f) => {
            const b = BADGE[getTag(place.tags, f.key)];
            return (
              <span key={f.key} title={`${f.label}: ${b.text}`} className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${b.cls}`}>
                {f.icon} {b.text}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
        <div className="flex gap-2">
          <button type="button" onClick={() => onCenter(place)}
            className="flex-1 rounded-xl border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
            📍 Center map
          </button>
          <button type="button" onClick={() => onFix(place)}
            className={`flex-1 rounded-xl px-2 py-1.5 text-xs font-bold text-white ${place.missing ? "bg-amber-500 hover:bg-amber-600" : "bg-enroute-600 hover:bg-enroute-700"}`}>
            {place.missing ? `Fix (${place.missing} missing)` : "Suggest edit"}
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onUse(place, "from")}
            className="flex-1 rounded-xl bg-enroute-50 px-2 py-1.5 text-[11px] font-black text-enroute-800 hover:bg-enroute-100">
            🚗 Use as pickup
          </button>
          <button type="button" onClick={() => onUse(place, "to")}
            className="flex-1 rounded-xl bg-enroute-50 px-2 py-1.5 text-[11px] font-black text-enroute-800 hover:bg-enroute-100">
            🏁 Use as drop-off
          </button>
        </div>
      </div>
    </article>
  );
}
