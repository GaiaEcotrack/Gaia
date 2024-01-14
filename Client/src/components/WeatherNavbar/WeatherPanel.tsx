/* eslint-disable */

import { useState } from "react";

import { ApiLoader } from "../../components/loaders/api-loader/ApiLoader";

import { Form } from "./Form";
import { Card } from "./Card";

function WeatherPanel() {
  let urlWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${import.meta.env.VITE_APP_WEATHER_API_KEY}&lang=es`;
  const cityUrl = "&q=";

  let urlForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${import.meta.env.VITE_APP_WEATHER_API_KEY}&lang=es`;

  const [weather, setWeather] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [location, setLocation] = useState("");

  const getLocation = async (loc: string) => {
    setLoading(true);
    setLocation(loc);

    urlWeather = urlWeather + cityUrl + loc;

    await fetch(urlWeather)
      .then((res) => {
        if (!res.ok) throw { res };
        return res.json();
      })
      .then((weatherData) => {
        console.log(weatherData);
        setWeather(weatherData);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setShow(false);
      });

    urlForecast = urlForecast + cityUrl + loc;

    await fetch(urlForecast)
      .then((res) => {
        if (!res.ok) throw { res };
        return res.json();
      })
      .then((forecastData) => {
        console.log(forecastData);
        setForecast(forecastData);

        setLoading(false);
        setShow(true);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setShow(false);
      });
  };

  return (
    <>
      <Form newLocation={getLocation} />
      {loading ? (
        <ApiLoader />
      ) : (
        <Card
          showData={show}
          loadingData={loading}
          weather={weather}
          forecast={forecast}
        />
      )}
    </>
  );
}

export { WeatherPanel };
