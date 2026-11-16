// Reusable radio button group; options = [{ value, label }]
export default function RadioGroup({ label, name, value, onChange, options }) {
  return (
    <fieldset className="field radio-group">
      <legend className="field-label">{label}</legend>
      <div className="radio-row">
        {options.map((opt) => (
          <label key={opt.value} className={`radio ${value === opt.value ? "active" : ""}`}>
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
