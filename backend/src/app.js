
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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

module.exports = app;
