import { useState, useEffect } from "react";
import { getTrips, createTrip, updateTrip, deleteTrip } from "../../api/trips";
import JourneyForm from "./JourneyForm";
import JourneyList from "./JourneyList";
import SearchBar from "./SearchBar";

// The CRUD module: Create, Read, Update, Delete + Search
export default function JourneysSection({ toast }) {
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // READ on first load
  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch(() => toast("Cannot reach the server. Start MongoDB and run: npm run server"))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // CREATE or UPDATE
  const handleSave = async (data) => {
    try {
      if (editingTrip) {
        const updated = await updateTrip(editingTrip.id, { ...data, id: editingTrip.id });
        setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTrip(null);
        toast("Journey updated");
      } else {
        const created = await createTrip(data);
        setTrips((prev) => [...prev, created]);
        toast("Journey added");
      }
    } catch {
      toast("Could not save. Is the server running?");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this journey?")) return;
    try {
      await deleteTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
      if (editingTrip?.id === id) setEditingTrip(null);
      toast("Journey deleted");
    } catch {
      toast("Could not delete. Is the server running?");
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    document.getElementById("journeys")?.scrollIntoView({ behavior: "smooth" });
  };

  // BONUS: live search
  const q = query.trim().toLowerCase();
  const visible = trips.filter((t) =>
    [t.name, t.from, t.to].some((v) => (v || "").toLowerCase().includes(q))
  );

  return (
    <section id="journeys" className="bg-enroute-50/70 backdrop-blur-sm py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="reveal mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.25em] text-enroute-600">Journeys</p>
          <h2 className="mt-2 text-3xl font-black sm:text-4xl">Manage Your Rides & Parcels</h2>
          <p className="mt-3 text-slate-600">Add, edit, search and remove journeys. Everything is saved to the database.</p>
        </div>

        <div className="crud layout">
          <JourneyForm editingTrip={editingTrip} onSave={handleSave} onCancel={() => setEditingTrip(null)} />

          <div>
            <div className="list-head">
              <h3 className="list-title">All journeys ({visible.length})</h3>
              <SearchBar value={query} onChange={setQuery} />
            </div>
            {loading
              ? <p className="empty">Loading…</p>
              : <JourneyList trips={visible} onEdit={handleEdit} onDelete={handleDelete} />}
          </div>
        </div>
      </div>
    </section>
  );
}
