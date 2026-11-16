import { useState, useEffect } from "react";
import ScenicRoad from "./ScenicRoad";
import HeroMap from "./HeroMap";
import { HERO_ROUTE } from "../../config/site";

export default function Hero({ onMode }) {
  const [eta, setEta] = useState(18); // live ETA

  useEffect(() => {
    const id = setInterval(() => {
      setEta((v) => Math.max(15, Math.min(23, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden backdrop-blur-[1px]">
      {/* decorative clouds */}
      <div className="cloud pointer-events-none absolute left-0 top-20 opacity-50">
        <svg width="130" height="45" viewBox="0 0 130 45">
          <path d="M15 37h98c10 0 14-8 8-14-3-3-7-4-12-4-1-10-10-17-20-17-8 0-15 4-18 11-4-5-10-7-16-7-9 0-17 7-18 16H15c-8 0-10 15 0 15Z" fill="white" />
        </svg>
      </div>
      <div className="cloud pointer-events-none absolute top-44 opacity-40" style={{ animationDuration: "32s", animationDelay: "-12s" }}>
        <svg width="100" height="36" viewBox="0 0 100 36">
          <path d="M12 30h75c8 0 10-8 5-12-3-2-5-3-9-3C82 7 76 3 69 3c-7 0-12 4-15 10-3-3-7-5-12-5-7 0-13 5-14 12H12c-6 0-7 10 0 10Z" fill="white" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-0 pt-12 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-8 lg:grid-cols-[.88fr_1.12fr]">
          {/* HERO TEXT */}
          <div className="reveal relative z-20">
            <div className="mb-5 text-xs font-black uppercase tracking-[.28em] text-enroute-700">
              Smarter Mobility. Cleaner Cities.
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-[4.4rem]">
              Share Rides.<br />
              Send Parcels.<br />
              <span className="text-enroute-600">Go Further Together.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-slate-600">
              AI-powered matching for people and parcels based on route, time, traffic and vehicle capacity.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => onMode("ride")}
                className="rounded-2xl bg-enroute-600 px-6 py-3.5 font-black text-white shadow-lg shadow-enroute-600/20 hover:bg-enroute-700">
                🚗 Find a Ride
              </button>
              <button onClick={() => onMode("parcel")}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-black hover:bg-slate-50">
                📦 Send a Parcel
              </button>
            </div>
          </div>

          {/* REAL MAP (OpenStreetMap) */}
          <div className="reveal relative h-[470px]">
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white shadow-soft">
              <HeroMap />

              {/* LIVE ETA */}
              <div className="float absolute right-5 top-5 z-[1000] w-52 rounded-2xl border border-white bg-white/95 p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live ETA</div>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-enroute-50 text-enroute-700">⏱</div>
                </div>
                <div className="mt-2 text-3xl font-black"><span>{eta}</span> min</div>
                <div className="text-xs font-semibold text-slate-500">via {HERO_ROUTE.via}</div>
                <div className="mt-2 inline-flex rounded-full bg-enroute-100 px-2.5 py-1 text-[10px] font-black text-enroute-800">
                  ● Moderate Traffic
                </div>
              </div>

              {/* MATCHED DRIVER */}
              <div className="float absolute bottom-8 left-5 z-[1000] rounded-2xl bg-enroute-700 px-4 py-3 text-white shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">✓</div>
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-wider text-enroute-200">AI MATCH</div>
                    <div className="text-xs font-black">Driver matched · 96%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ScenicRoad />
      </div>
    </section>
  );
}
