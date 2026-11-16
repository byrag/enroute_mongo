// BONUS: live search input
export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search by name, pickup or destination"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search journeys"
    />
  );
}
