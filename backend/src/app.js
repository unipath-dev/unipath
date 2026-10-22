
const express = require("express");
const cors = require("cors");
const universityRoutes = require("./routes/universityRoutes");
const rankingRoutes = require("./routes/rankingRoutes");

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://unipath-bi2c.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the UniPath API!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "UniPath API is running",
  });
});

app.use("/api/universities", universityRoutes);
app.use("/api/rankings", rankingRoutes);

module.exports = app;
