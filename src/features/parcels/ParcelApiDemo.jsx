import { useState } from "react";
import { copyText, notify } from "../../utils/webApis";

const STATUSES = ["Ready for Pickup", "In Transit", "Near Destination", "Delivered"];

function openParcelDB() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) return reject(new Error("IndexedDB is not supported."));
    const req = indexedDB.open("EnrouteParcelDB", 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("parcels")) db.createObjectStore("parcels", { keyPath: "trackingId" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => reject(req.error);
  });
}

export default function ParcelApiDemo({ toast }) {
  const [preview, setPreview] = useState(null); // { kind: "image" | "text", value }
  const [dropStatus, setDropStatus] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [statusIdx, setStatusIdx] = useState(0);

  const status = STATUSES[statusIdx];
  const id = trackingId.trim() || "ENR-PARCEL-2026";

  // File API
  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview({ kind: "image", value: ev.target.result });
      reader.readAsDataURL(file);
    } else {
      setPreview({ kind: "text", value: `Attached: ${file.name} (${Math.round(file.size / 1024)} KB)` });
    }
    toast(`Parcel file attached: ${file.name}`);
  };

  // Drag and Drop API
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setDropStatus("Please drop a parcel image.");
    setDropStatus(`✓ Attached: ${file.name}`);
    toast("Parcel image attached using Drag & Drop API.");
  };

  // IndexedDB API
  const saveRecord = async () => {
    const tid = trackingId.trim() || `ENR${Date.now().toString().slice(-6)}`;
    try {
      const db = await openParcelDB();
      const tx = db.transaction("parcels", "readwrite");
      tx.objectStore("parcels").put({ trackingId: tid, status, savedAt: new Date().toLocaleString() });
      tx.oncomplete = () => { setTrackingId(tid); toast(`Parcel ${tid} saved offline.`); };
    } catch {
      toast("IndexedDB is unavailable in this browser.");
    }
  };

  const showHistory = async () => {
    try {
      const db = await openParcelDB();
      const req = db.transaction("parcels", "readonly").objectStore("parcels").getAll();
      req.onsuccess = () => {
        const records = req.result;
        if (!records.length) return toast("No saved parcel records yet.");
        toast(records.slice(-5).map((p) => `${p.trackingId}: ${p.status}`).join(" | "));
      };
    } catch {
      toast("Could not read parcel history.");
    }
  };

  // Notifications API
  const updateStatus = async () => {
    const next = (statusIdx + 1) % STATUSES.length;
    setStatusIdx(next);
    toast(`Parcel status updated: ${STATUSES[next]}`);
    if ("Notification" in window) {
      if (Notification.permission === "default") await Notification.requestPermission();
      notify("Enroute Parcel Update", `Your parcel status is now: ${STATUSES[next]}`);
    }
  };

  // Web Share API
  const shareParcel = async () => {
    const data = { title: "Enroute Parcel Tracking", text: `Track my Enroute parcel: ${id}` };
    if (navigator.share) {
      try { await navigator.share(data); toast("Parcel tracking shared."); }
      catch (e) { if (e.name !== "AbortError") toast("Sharing was cancelled or failed."); }
    } else {
      await copyText(`Enroute Parcel Tracking: ${id}`);
      toast("Web Share is unavailable. Tracking details copied instead.");
    }
  };

  // Clipboard API
  const copyId = async () => {
    try { await copyText(id); toast(`Copied tracking ID: ${id}`); }
    catch { toast("Clipboard access was blocked by the browser."); }
  };

  const card = "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm";
  const outlineBtn = "mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-black";
  const greenBtn = "mt-2 w-full rounded-xl bg-enroute-600 px-3 py-2 text-xs font-black text-white";

  return (
    <section id="parcelApiDemo" className="bg-white/80 backdrop-blur-sm py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="reveal mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[.25em] text-amber-600">Parcel Delivery APIs</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Try the Parcel Delivery Features</h2>
          <p className="mt-3 text-slate-600">
            Demonstrations of browser APIs used by Enroute for parcel pickup, tracking, sharing, notifications and offline delivery history.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* File API */}
          <div className={card}>
            <div className="text-3xl">📄</div>
            <h3 className="mt-3 font-black">Parcel Document</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">File API: select a parcel image/invoice and preview it before delivery.</p>
            <input type="file" accept="image/*,.pdf" onChange={onFile}
              className="mt-4 w-full rounded-xl border border-slate-200 p-2 text-xs" />
            {preview && (
              <div className="mt-3 overflow-hidden rounded-xl border bg-slate-50 p-2 text-xs">
                {preview.kind === "image"
                  ? <img src={preview.value} alt="Parcel preview" className="mx-auto max-h-32 rounded-lg" />
                  : preview.value}
              </div>
            )}
          </div>

          {/* Drag & Drop API */}
          <div className={card}>
            <div className="text-3xl">📦</div>
            <h3 className="mt-3 font-black">Drag & Drop Parcel</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Drag a parcel image into the box to attach it to the delivery.</p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`mt-4 grid min-h-28 place-items-center rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 p-4 text-center text-xs font-bold text-amber-800 ${dragOver ? "ring-2 ring-amber-400" : ""}`}>
              Drop parcel image here
            </div>
            <div className="mt-2 text-center text-xs text-slate-500">{dropStatus}</div>
          </div>

          {/* IndexedDB API */}
          <div className={card}>
            <div className="text-3xl">🗃️</div>
            <h3 className="mt-3 font-black">Offline Parcel History</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">IndexedDB: save parcel tracking records locally in the browser.</p>
            <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs" placeholder="Tracking ID e.g. ENR12345" />
            <button onClick={saveRecord} className={greenBtn}>Save Tracking Record</button>
            <button onClick={showHistory} className={outlineBtn}>View Saved Parcels</button>
          </div>

          {/* Notifications + Share + Clipboard */}
          <div className={card}>
            <div className="text-3xl">🚚</div>
            <h3 className="mt-3 font-black">Track & Share</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Notifications, Web Share and Clipboard APIs for parcel updates.</p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3">
              <div className="text-[9px] font-black uppercase text-slate-400">Status</div>
              <div className="mt-1 text-sm font-black">{status}</div>
            </div>
            <button onClick={updateStatus} className={greenBtn}>Simulate Status Update</button>
            <button onClick={shareParcel} className={outlineBtn}>📤 Share Tracking</button>
            <button onClick={copyId} className={outlineBtn}>📋 Copy Tracking ID</button>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-enroute-900 p-6 text-white shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-enroute-300">Parcel Tracking</p>
              <h3 className="mt-1 text-xl font-black">ENR-PARCEL-2026</h3>
              <p className="mt-1 text-sm text-enroute-100">Pickup → In Transit → Near Destination → Delivered</p>
            </div>
            <div className="rounded-full bg-white/10 px-5 py-3 text-sm font-black">
              {statusIdx + 1} / {STATUSES.length} · {status}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
