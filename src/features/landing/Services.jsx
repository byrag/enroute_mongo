export default function Services() {
  return (
    <section id="services" className="bg-enroute-50/70 backdrop-blur-sm py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.25em] text-enroute-600">Our Services</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Two Services. One Smarter Network.</h2>
          <p className="mt-3 text-slate-600">Move people and parcels along compatible routes.</p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2">
          <div className="reveal flex items-center gap-5 rounded-3xl border border-enroute-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-enroute-100 text-2xl">🚗</div>
            <div className="flex-1">
              <h3 className="font-black text-xl">Carpooling</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">Find rides based on route, time and available seats.</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-enroute-50 font-black text-enroute-700">→</span>
          </div>

          <div className="reveal flex items-center gap-5 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-50 text-2xl">📦</div>
            <div className="flex-1">
              <h3 className="font-black text-xl">Parcel Delivery</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">Match parcels with drivers travelling your route.</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-amber-50 font-black text-amber-700">→</span>
          </div>
        </div>
      </div>
    </section>
  );
}
