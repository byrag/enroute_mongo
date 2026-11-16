// Express + Mongoose REST API for Enroute journeys (replaces JSON Server)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/EnrouteDB")
  .then(() => console.log("MongoDB Connected (EnrouteDB)"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// Same fields the React form already uses
const tripSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["ride", "parcel"], required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, match: /^\d{10}$/ },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    capacity: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  {
    toJSON: {
      // React code uses `trip.id`, so expose Mongo's _id as id
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Trip = mongoose.model("Trip", tripSchema, "trips");

// READ all (optional ?q= search on name / from / to)
app.get("/trips", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q
      ? {
          $or: ["name", "from", "to"].map((f) => ({
            [f]: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
          })),
        }
      : {};
    res.json(await Trip.find(filter).sort({ _id: 1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE
app.post("/trips", async (req, res) => {
  try {
    const { id, _id, ...data } = req.body;
    res.status(201).json(await Trip.create(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE
app.put("/trips/:id", async (req, res) => {
  try {
    const { id, _id, ...data } = req.body;
    const updated = await Trip.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Trip not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete("/trips/:id", async (req, res) => {
  try {
    const deleted = await Trip.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Trip not found" });
    res.json({ message: "Trip deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Server Running on Port 3001"));
