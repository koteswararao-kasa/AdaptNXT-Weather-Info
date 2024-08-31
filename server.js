const express = require("express");
const axios = require("axios");

const app = express();

const WeatherStack_Api_Key = "29a40fefd9ff1ed984df6b0b0327cb64";
const WeatherStack_Api_Url = "http://api.weatherstack.com/current";

app.use(express.json());

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).send({ error: "City is required" });
  }

  try {
    const response = await axios.get(WeatherStack_Api_Url, {
      params: {
        access_key: WeatherStack_Api_Key,
        query: city,
      },
    });

    const data = response.data;

    if (data.error) {
      return res.status(400).send({ error: data.error.info });
    }

    const weatherInfo = {
      location: data.location.name,
      temperature: data.current.temperature,
      weather_descriptions: data.current.weather_descriptions[0],
      humidity: data.current.humidity,
      wind_speed: data.current.wind_speed,
    };

    res.send(weatherInfo);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send({ error: "Failed to fetch weather data" });
  }
});

app.listen(3000, () => {
  console.log("Server Running at http://localhost:3000/");
});
