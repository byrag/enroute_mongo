import { CATEGORIES, PRESETS, OSM_FIELDS, SORT_OPTIONS } from "./constants";

const label = "text-[10px] font-black uppercase tracking-wider text-slate-400";
const input =
  "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-enroute-500 focus:ring-2 focus:ring-enroute-500/20";

export default function SearchPanel({ ex, inputRef }) {
  const { form, updateForm, formError, filters, toggleFilter, matchMode, setMatchMode,
    includeUnknown, setIncludeUnknown, sortBy, setSortBy, loading } = ex;

  const submit = (e) => {
    e.preventDefault();
    ex.search();
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl border border-white bg-white/95 p-5 shadow-soft">
      {/* Location */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="exploreQuery" className={label}>Area or address</label>
          <button type="button" onClick={ex.locateMe} className="text-xs font-bold text-enroute-700 hover:underline">
            📍 Use my location
          </button>
        </div>
        <div className="relative">
          <input
            id="exploreQuery"
            ref={inputRef}
            value={form.query}
            onChange={(e) => updateForm({ query: e.target.value })}
            placeholder="e.g. Koramangala, Bengaluru"
            className={input}
            autoComplete="off"
          />
          {form.query && (
            <button type="button" onClick={() => updateForm({ query: "" })} aria-label="Clear"
              className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-slate-400 hover:text-slate-700">✕</button>
          )}
        </div>
        {formError && <p className="mt-1 text-xs font-semibold text-red-500">{formError}</p>}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button key={p.value} type="button"
              onClick={() => { updateForm({ query: p.value }); ex.search({ query: p.value }); }}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-enroute-100 hover:text-enroute-800">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category + radius */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label htmlFor="exploreCategory" className={label}>Place type</label>
          <select id="exploreCategory" value={form.category} onChange={(e) => updateForm({ category: e.target.value })} className={input}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="exploreRadius" className={label}>
            Radius: {form.radius} m ({(form.radius / 1000).toFixed(1)} km)
          </label>
          <input id="exploreRadius" type="range" min="200" max="3000" step="100" value={form.radius}
            onChange={(e) => updateForm({ radius: +e.target.value })} className="mt-3 w-full accent-enroute-600" />
        </div>
      </div>

      {/* Filters */}
      <div>
        <div className="flex items-center justify-between">
          <span className={label}>Must have</span>
          <button type="button" onClick={() => setMatchMode(matchMode === "AND" ? "OR" : "AND")}
            className="rounded-lg border border-enroute-200 bg-enroute-50 px-2 py-0.5 text-[11px] font-black text-enroute-700">
            {matchMode === "AND" ? "Match ALL (AND)" : "Match ANY (OR)"}
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {OSM_FIELDS.map((f) => (
            <label key={f.key}
              className={`flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-xs font-bold ${
                filters.includes(f.key) ? "border-enroute-500 bg-enroute-50 text-enroute-800" : "border-slate-200 text-slate-600"
              }`}>
              <input type="checkbox" checked={filters.includes(f.key)} onChange={() => toggleFilter(f.key)} className="accent-enroute-600" />
              <span>{f.icon} {f.label}</span>
            </label>
          ))}
        </div>
        <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-slate-600">
          <input type="checkbox" checked={includeUnknown} onChange={(e) => setIncludeUnknown(e.target.checked)} className="mt-0.5 accent-amber-600" />
          <span>Include places with <b>unverified</b> tags (missing data is not treated as “no”)</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <label htmlFor="exploreSort" className={label}>Sort results</label>
        <select id="exploreSort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={input}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={loading}
          className="flex-1 rounded-xl bg-enroute-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-enroute-600/20 hover:bg-enroute-700 disabled:opacity-60">
          {loading ? "Querying OpenStreetMap…" : "Find places"}
        </button>
        <button type="button" onClick={ex.loadSample}
          className="rounded-xl border border-slate-200 px-3 py-3 text-xs font-black text-slate-700 hover:bg-slate-50">Demo data</button>
        <button type="button" onClick={ex.resetFilters}
          className="rounded-xl border border-slate-200 px-3 py-3 text-xs font-black text-slate-700 hover:bg-slate-50">Reset</button>
      </div>
    </form>
  );
}
