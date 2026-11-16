export default function Cta() {
  return (
    <section id="about" className="bg-enroute-50/70 px-5 py-14 backdrop-blur-sm">
      <div className="reveal mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded-3xl bg-enroute-900 px-7 py-9 text-center text-white sm:flex-row sm:text-left">
        <div>
          <p className="text-xs font-black uppercase tracking-[.2em] text-enroute-300">Enroute</p>
          <h2 className="mt-2 text-2xl font-black">Different journeys. A brighter tomorrow.</h2>
          <p className="mt-1 text-sm text-enroute-100">People • Parcels • A Smarter Tomorrow</p>
        </div>
        <button
          onClick={() => document.getElementById("searchBox")?.scrollIntoView({ behavior: "smooth", block: "center" })}
          className="shrink-0 rounded-xl bg-white px-5 py-3 font-black text-enroute-900 hover:bg-enroute-50">
          Start Your Journey →
        </button>
      </div>
    </section>
  );
}
