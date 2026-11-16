// All REST calls (Express + MongoDB) live here, so components stay clean.
const BASE = "http://localhost:3001/trips";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.status === 204 ? null : res.json();
}

export const getTrips = () => request(BASE);                                   // READ
export const createTrip = (trip) =>
  request(BASE, { method: "POST", body: JSON.stringify(trip) });               // CREATE
export const updateTrip = (id, trip) =>
  request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(trip) });     // UPDATE
export const deleteTrip = (id) => request(`${BASE}/${id}`, { method: "DELETE" }); // DELETE
