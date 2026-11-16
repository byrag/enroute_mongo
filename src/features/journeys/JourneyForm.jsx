import { useState, useEffect } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import RadioGroup from "../../components/ui/RadioGroup";
import Button from "../../components/ui/Button";

const SEATS = ["1", "2", "3", "4"];
const SIZES = ["Small", "Medium", "Large"];

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  type: "ride",
  name: "",
  phone: "",
  from: "",
  to: "",
  date: today(),
  capacity: "1",
  notes: "",
});

// Used for BOTH adding and editing a journey
export default function JourneyForm({ editingTrip, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});

  // When Edit is clicked, fill the form; when cleared, reset it
  useEffect(() => {
    setForm(editingTrip ? { ...emptyForm(), ...editingTrip } : emptyForm());
    setErrors({});
  }, [editingTrip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Switching ride <-> parcel changes what the dropdown means
      if (name === "type") next.capacity = value === "ride" ? "1" : "Small";
      return next;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your name";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit phone number";
    if (!form.from.trim()) e.from = "Enter a pickup location";
    if (!form.to.trim()) e.to = "Enter a destination";
    if (!form.date) e.date = "Choose a date";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, name: form.name.trim(), from: form.from.trim(), to: form.to.trim() });
    if (!editingTrip) setForm(emptyForm());
  };

  const isRide = form.type === "ride";

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>{editingTrip ? "Edit journey" : "Add a journey"}</h2>

      <RadioGroup
        label="I want to"
        name="type"
        value={form.type}
        onChange={handleChange}
        options={[
          { value: "ride", label: "Share a ride" },
          { value: "parcel", label: "Send a parcel" },
        ]}
      />

      <div className="grid-2">
        <InputField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <InputField label="Phone" name="phone" type="tel" inputMode="numeric" maxLength={10}
          value={form.phone} onChange={handleChange} error={errors.phone} />
        <InputField label="From" name="from" value={form.from} onChange={handleChange}
          placeholder="Pickup location" error={errors.from} />
        <InputField label="To" name="to" value={form.to} onChange={handleChange}
          placeholder="Destination" error={errors.to} />
        <InputField label="Date" name="date" type="date" value={form.date} onChange={handleChange} error={errors.date} />
        <SelectField
          label={isRide ? "Seats" : "Parcel size"}
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          options={isRide ? SEATS : SIZES}
        />
      </div>

      <label className="field">
        <span className="field-label">Notes (optional)</span>
        <textarea name="notes" rows="2" value={form.notes} onChange={handleChange} />
      </label>

      <div className="actions">
        <Button type="submit">{editingTrip ? "Save changes" : "Add journey"}</Button>
        {editingTrip && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}
