import Counter from "./Counter";
import { STATS } from "../../config/site";

export default function Stats() {
  return (
    <section className="border-b border-slate-100 bg-white/75 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-5 px-5 py-7 sm:justify-between">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className={`font-black ${s.green ? "text-enroute-600" : ""}`}>
                <Counter target={s.target} />{s.suffix}
              </div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
