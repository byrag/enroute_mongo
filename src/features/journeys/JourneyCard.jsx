import Button from "../../components/ui/Button";

// One record, with Edit and Delete buttons
export default function JourneyCard({ trip, onEdit, onDelete }) {
  const isRide = trip.type === "ride";
  return (
    <article className="card trip">
      <div className="trip-top">
        <span className={`badge ${isRide ? "badge-ride" : "badge-parcel"}`}>
          {isRide ? "Ride" : "Parcel"}
        </span>
        <span className="trip-date">{trip.date}</span>
      </div>
      <h3>{trip.from} to {trip.to}</h3>
      <p className="trip-meta">
        {isRide ? `${trip.capacity} seat(s)` : `${trip.capacity} parcel`} · {trip.name} · {trip.phone}
      </p>
      {trip.notes && <p className="trip-notes">{trip.notes}</p>}
      <div className="actions">
        <Button variant="ghost" onClick={() => onEdit(trip)}>Edit</Button>
        <Button variant="danger" onClick={() => onDelete(trip.id)}>Delete</Button>
      </div>
    </article>
  );
}
