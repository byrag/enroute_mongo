import { useState, useEffect } from "react";
import { copyText, notify } from "../../utils/webApis";

const SEATS = ["1", "2", "3", "4"];
const SIZES = ["Small", "Medium", "Large"];
const KEY = "enroute_recent_searches";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const readSaved = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export default function SearchBox({ mode, onMode, toast, draft }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState(todayStr());
  const [capacity, setCapacity] = useState("1");

  // A place picked on the map fills pickup / destination
  useEffect(() => {
    if (!draft) return;
    if (draft.field === "from") setFrom(draft.value);
    else setTo(draft.value);
  }, [draft]);

  const options = mode === "ride" ? SEATS : SIZES;
  const cap = options.includes(capacity) ? capacity : options[0];

  const journey = () => ({ mode, from: from.trim(), to: to.trim(), date, capacity: cap });
  const label = (j) => `Enroute ${j.mode === "ride" ? "Ride" : "Parcel"}`;

  // Geolocation API
  const locateMe = () => {
    if (!("geolocation" in navigator)) return toast("Geolocation is not supported by this browser.");
    toast("Requesting your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const coords = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setFrom(`My location (${coords})`);
        sessionStorage.setItem("enroute_last_location", coords);
        toast(`Location detected (±${Math.round(accuracy)}m).`);
      },
      (err) => {
        const m = { 1: "Location permission was denied.", 2: "Your location could not be determined.", 3: "Location request timed out." };
        toast(m[err.code] || "Unable to get your location.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Web Storage API
  const saveJourney = () => {
    const j = journey();
    if (!j.from || !j.to) return toast("Enter pickup and destination before saving.");
    localStorage.setItem(KEY, JSON.stringify([{ ...j, savedAt: new Date().toLocaleString() }, ...readSaved()].slice(0, 5)));
    toast("Journey saved in your browser.");
  };

  const showRecent = () => {
    const latest = readSaved()[0];
    if (!latest) return toast("No saved searches yet.");
    onMode(latest.mode || "ride", false);
    setFrom(latest.from);
    setTo(latest.to);
    setDate(latest.date);
    setCapacity(latest.capacity);
    toast(`Loaded: ${latest.from} → ${latest.to}`);
  };

  // Notifications API
  const enableNotifications = async () => {
    if (!("Notification" in window)) return toast("Notifications are not supported by this browser.");
    if (!window.isSecureContext) return toast("Notifications require HTTPS or localhost.");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("Enroute Notifications Enabled", { body: "You can now receive Enroute journey updates." });
      toast("Notifications enabled.");
    } else {
      toast("Notification permission was not granted.");
    }
  };

  // Web Share API
  const shareJourney = async () => {
    const j = journey();
    if (!j.from || !j.to) return toast("Enter pickup and destination first.");
    const text = `${label(j)}\n${j.from} → ${j.to}\nDate: ${j.date}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Enroute Journey", text, url: window.location.href });
        toast("Journey shared successfully.");
      } catch (e) {
        if (e.name !== "AbortError") toast("Sharing was cancelled or unavailable.");
      }
    } else {
      await copyText(text);
      toast("Web Share is unavailable. Details copied instead.");
    }
  };

  // Clipboard API
  const copyJourney = async () => {
    const j = journey();
    if (!j.from || !j.to) return toast("Enter pickup and destination first.");
    try {
      const ok = await copyText(`${label(j)}: ${j.from} → ${j.to} | ${j.date}`);
      toast(ok ? "Journey details copied to clipboard." : "Clipboard access requires HTTPS or localhost.");
    } catch {
      toast("Could not copy journey details.");
    }
  };

  const search = () => {
    const j = journey();
    if (!j.from || !j.to) return toast("Enter both pickup and destination.");
    localStorage.setItem(KEY, JSON.stringify([{ ...j, savedAt: new Date().toLocaleString() }, ...readSaved()].slice(0, 5)));
    toast(mode === "ride" ? `Finding rides from ${j.from} to ${j.to}...` : `Finding parcel drivers from ${j.from} to ${j.to}...`);
    notify("Enroute Journey Update", `Search started: ${j.from} → ${j.to}`);
  };

  const onEnter = (e) => { if (e.key === "Enter") search(); };
  const border = (v) => ({ borderColor: v.trim() ? "#10b981" : "#e2e8f0" });

  const ghostBtn = "rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] font-black text-slate-700 hover:bg-slate-50";

  return (
    <section className="relative z-30 -mt-4 mb-0 bg-transparent px-5 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div id="searchBox" className="relative z-30 w-full overflow-hidden rounded-3xl border border-white bg-white/95 shadow-soft backdrop-blur">
          <div className="grid grid-cols-2 border-b border-slate-100">
            <button onClick={() => onMode("ride", false)}
              className={`px-4 py-3 text-left font-black ${mode === "ride" ? "bg-enroute-50 text-enroute-700" : "text-slate-500"}`}>
              🚗 Find a Ride
              <div className="pl-6 text-[10px] font-semibold text-slate-400">Travel together</div>
            </button>
            <button onClick={() => onMode("parcel", false)}
              className={`px-4 py-3 text-left font-black ${mode === "parcel" ? "bg-amber-50 text-amber-700" : "text-slate-500"}`}>
              📦 Send a Parcel
              <div className="pl-6 text-[10px] font-semibold text-slate-400">Deliver on the move</div>
            </button>
          </div>

          <div className="grid gap-2 p-3 sm:grid-cols-[1fr_1fr_.7fr_.65fr_auto]">
            <div className="rounded-xl border border-slate-200 px-3 py-2.5" style={border(from)}>
              <div className="text-[9px] font-black uppercase text-slate-400">From</div>
              <input value={from} onChange={(e) => setFrom(e.target.value)} onKeyDown={onEnter}
                className="mt-0.5 w-full bg-transparent text-xs font-bold outline-none" placeholder="Pickup location" />
            </div>
            <div className="rounded-xl border border-slate-200 px-3 py-2.5" style={border(to)}>
              <div className="text-[9px] font-black uppercase text-slate-400">To</div>
              <input value={to} onChange={(e) => setTo(e.target.value)} onKeyDown={onEnter}
                className="mt-0.5 w-full bg-transparent text-xs font-bold outline-none" placeholder="Destination" />
            </div>
            <div className="rounded-xl border border-slate-200 px-3 py-2.5">
              <div className="text-[9px] font-black uppercase text-slate-400">Date</div>
              <input type="date" value={date}
                onChange={(e) => { setDate(e.target.value); if (e.target.value) toast("Journey date selected: " + e.target.value); }}
                className="mt-0.5 w-full bg-transparent text-xs font-bold outline-none" />
            </div>
            <div className="rounded-xl border border-slate-200 px-3 py-2.5">
              <div className="text-[9px] font-black uppercase text-slate-400">{mode === "ride" ? "Seats" : "Parcel Size"}</div>
              <select value={cap} onChange={(e) => setCapacity(e.target.value)}
                className="mt-0.5 w-full bg-transparent text-xs font-bold outline-none">
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <button onClick={search}
              className="rounded-xl bg-enroute-600 px-4 py-2.5 text-xs font-black text-white hover:bg-enroute-700">
              Search →
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-3 py-3">
            <button onClick={locateMe}
              className="rounded-xl border border-enroute-200 bg-enroute-50 px-3 py-2 text-[11px] font-black text-enroute-800 hover:bg-enroute-100">
              📍 Use My Location
            </button>
            <button onClick={saveJourney} className={ghostBtn}>💾 Save Search</button>
            <button onClick={showRecent} className={ghostBtn}>🕘 Recent Searches</button>
            <button onClick={shareJourney} className={ghostBtn}>📤 Share</button>
            <button onClick={copyJourney} className={ghostBtn}>📋 Copy</button>
            <button onClick={enableNotifications} className={ghostBtn}>🔔 Notifications</button>
          </div>
        </div>
      </div>
    </section>
  );
}
