import { useState, useMemo } from "react";
import { OSM_FIELDS } from "./constants";
import { getTag } from "./tags";

const CHOICES = [
  { value: "yes", label: "Yes", cls: "text-emerald-700" },
  { value: "limited", label: "Partial", cls: "text-blue-700" },
  { value: "no", label: "No", cls: "text-rose-700" },
  { value: "skip", label: "Skip", cls: "text-slate-400" },
];

// Lets a visitor record what they observed. Stored locally — never sent to OSM.
export default function FixModal({ place, onClose, onSave }) {
  const [answers, setAnswers] = useState(() => Object.fromEntries(OSM_FIELDS.map((f) => [f.key, "skip"])));
  const [note, setNote] = useState("");
  const [error, setError] = useState(false);

  const suggested = useMemo(() => {
    const out = {};
    OSM_FIELDS.forEach(({ key }) => {
      const v = answers[key];
      if (v !== "skip") out[key] = key === "internet_access" && v === "yes" ? "wlan" : v;
    });
    return out;
  }, [answers]);
  const count = Object.keys(suggested).length;

  const submit = (e) => {
    e.preventDefault();
    if (!count) return setError(true);
    onSave(place, suggested, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={onClose}>
      <form onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}
        role="dialog" aria-modal="true" aria-labelledby="fixTitle"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="fixTitle" className="text-lg font-black">{place.tags.name}</h3>
            <p className="text-xs text-slate-500">
              {place.key} • {place.tags.amenity || "n/a"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-slate-400 hover:text-slate-800">✕</button>
        </div>

        <div className="mt-4 space-y-2.5">
          {OSM_FIELDS.map((f) => (
            <div key={f.key} className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-bold">{f.icon} {f.label}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  Current: <b className="capitalize text-slate-600">{getTag(place.tags, f.key)}</b>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {CHOICES.map((c) => {
                  const on = answers[f.key] === c.value;
                  return (
                    <label key={c.value}
                      className={`flex cursor-pointer items-center justify-center rounded-lg border p-1.5 text-center font-bold ${
                        on ? "border-enroute-500 bg-enroute-50 ring-2 ring-enroute-500" : "border-slate-200 bg-white hover:bg-slate-50"
                      } ${c.cls}`}>
                      <input type="radio" className="sr-only" name={`fix_${f.key}`} value={c.value} checked={on}
                        onChange={() => { setAnswers((a) => ({ ...a, [f.key]: c.value })); setError(false); }} />
                      {c.label}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <label className="mt-4 block text-xs font-bold text-slate-600">
          Observation note (optional)
          <textarea value={note} maxLength={200} rows={2} onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm font-normal outline-none focus:border-enroute-500" />
          <span className="block text-right text-[10px] font-normal text-slate-400">{note.length} / 200</span>
        </label>

        <div className="mt-2">
          <div className="mb-1 flex justify-between text-[11px] font-bold text-slate-500">
            <span>Proposed tags (JSON)</span>
            <span>{count} tag{count === 1 ? "" : "s"} modified</span>
          </div>
          <pre className="max-h-32 overflow-auto rounded-xl bg-slate-950 p-3 text-[11px] text-emerald-300">{JSON.stringify(suggested, null, 2)}</pre>
        </div>

        {error && <p className="mt-2 text-xs font-bold text-red-500">Choose at least one tag to update.</p>}
        <p className="mt-3 text-[11px] text-slate-400">Saved in this browser only. Verify before submitting to OpenStreetMap.</p>

        <div className="mt-4 flex gap-2">
          <button type="submit" className="flex-1 rounded-xl bg-enroute-600 px-4 py-2.5 text-sm font-black text-white hover:bg-enroute-700">Save contribution</button>
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50">Cancel</button>
        </div>
      </form>
    </div>
  );
}
