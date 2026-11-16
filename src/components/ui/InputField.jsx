// Reusable text/date/tel input with a label and optional error
export default function InputField({ label, name, value, onChange, error, ...rest }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input name={name} value={value} onChange={onChange} {...rest} />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
