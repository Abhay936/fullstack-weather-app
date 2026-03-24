import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cities")) || [];
    setHistory(data);
  }, []);

  const saveCity = (city) => {
    const old = JSON.parse(localStorage.getItem("cities")) || [];
    const updated = [city, ...old.filter((c) => c !== city)].slice(0, 5);
    localStorage.setItem("cities", JSON.stringify(updated));
  };

  const getForecast = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/weather?city=${city}`
      );
      const data = res.data.list;
      const dailyData = data.filter((_, index) => index % 8 === 0);
      setForecast(dailyData.slice(0, 5));
    } catch (err) {
      console.log("Forecast error");
    }
  };

  const getWeather = async () => {
    if (!city.trim()) {
      setWeather(null);
      setForecast([]);
      setError("Enter city name");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/weather?city=${city}`
      );

      setWeather(res.data);
      await getForecast();
      saveCity(city);
      setHistory(JSON.parse(localStorage.getItem("cities")));

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setWeather(null);
      setForecast([]);
      setError("City not found or API error");
    }
  };

  const getBackground = () => {
    if (!weather) return "#1e3c72";

    const condition = weather.weather[0].main;

    if (condition === "Clear") return "#f7b733";
    if (condition === "Clouds") return "#757F9A";
    if (condition === "Rain" || condition === "Drizzle") return "#005C97";
    if (condition === "Snow") return "#83a4d4";
    if (condition === "Mist" || condition === "Haze") return "#636e72";

    return "linear-gradient(to bottom, #005C97, #363795)";
  };

  const today = new Date();
  const todayDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const getDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { weekday: "short" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: getBackground(),
        color: "white",
        transition: "0.5s",
      }}
    >
      <div
        style={{
          padding: "30px",
          margin: "20px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          textAlign: "center",
          width: "550px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <h1>🌤️ Weather App</h1>

        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => {
            const value = e.target.value;
            setCity(value);

            if (!value.trim()) {
              setWeather(null);
              setForecast([]);
              setError("");
            }
          }}
          style={{
            padding: "10px",
            width: "80%",
            borderRadius: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <br />
        <br />

        <button
          onClick={getWeather}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#fff",
          }}
        >
          Search
        </button>

        {/* 🔥 Search History */}
        {history.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <p style={{ fontSize: "14px", opacity: 0.8 }}>
              Recent Searches:
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCity(item);
                    getWeather();
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <p style={{ marginTop: "10px" }}>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {weather && weather.main && (
          <div style={{ marginTop: "20px" }}>
            <h2>{weather.name}</h2>
            <p>{todayDate}</p>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <h1>{weather.main.temp}°C</h1>
            <p>{weather.weather[0].main}</p>

            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind: {weather.wind.speed} km/h</p>
          </div>
        )}

        {forecast.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <h3>Forecast</h3>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {forecast.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    width: "70px",
                    minHeight: "100px",
                  }}
                >
                  <p>{getDay(item.dt_txt)}</p>
                  <p>{item.main.temp}°C</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;