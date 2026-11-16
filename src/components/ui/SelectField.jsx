// Reusable dropdown
export default function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  );
}
