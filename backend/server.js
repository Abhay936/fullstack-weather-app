import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Route 1: Current Weather
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City required" });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;
    console.log(process.env.API_KEY);

    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching weather" });
  }
});

// 🔥 Route 2: 5-day Forecast
app.get("/forecast", async (req, res) => {
  const city = req.query.city;

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`;

    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching forecast" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});