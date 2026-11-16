const STEPS = [
  { icon: "📍", title: "Enter Details", text: "Add pickup, destination and requirements." },
  { icon: "🧠", title: "AI Finds a Match", text: "Analyse routes, traffic and availability." },
  { icon: "🚗", title: "Confirm & Go", text: "Choose your match and start the journey." },
  { icon: "✓", title: "Track Your Journey", text: "Follow the route with ETA updates." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-white/75 backdrop-blur-sm py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="reveal text-center">
          <p className="text-xs font-black uppercase tracking-[.25em] text-enroute-600">How It Works</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">A Smarter Way to Move</h2>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="reveal text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-enroute-600 font-black text-white">{i + 1}</div>
              <div className="mt-4 text-2xl">{s.icon}</div>
              <h3 className="mt-2 font-black">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
