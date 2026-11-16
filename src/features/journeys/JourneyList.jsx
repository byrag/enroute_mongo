import JourneyCard from "./JourneyCard";

// READ: displays all records (or an empty state)
export default function JourneyList({ trips, onEdit, onDelete }) {
  if (trips.length === 0) {
    return <p className="empty">No journeys found. Add one using the form.</p>;
  }
  return (
    <div className="list">
      {trips.map((trip) => (
        <JourneyCard key={trip.id} trip={trip} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
