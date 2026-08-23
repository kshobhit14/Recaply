const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_, res) => res.json({ ok: true, service: "recaply-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: err.message || "Something went wrong" });
});

module.exports = app;
