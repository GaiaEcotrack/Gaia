/* eslint-disable */
import { TiWeatherPartlySunny } from "react-icons/ti";
import { useState, useEffect } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { ApiLoader } from '../../components/loaders/api-loader/ApiLoader'

interface FormProps {
  newLocation: any;
}

interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

function Form({ newLocation }: FormProps) {
  const [city, setCity] = useState("");
  const [weatherLocation, setWeatherLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e: any) => {
    e.preventDefault();
    console.log({ city });
    // alert('holas')
    if (city === "" || !city) return;

    newLocation(city);
  };

  // clima segun location
  useEffect(() => {
    const getLocation = () => {
      return new Promise<GeolocationCoordinates>((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            (error) => reject(error)
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    };

    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        setIsLoading(true);
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&lang=es`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setWeatherLocation(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }finally {
        setIsLoading(false);
      }
    };

    const loadWeatherData = async () => {
      try {
        const coords = await getLocation();
        fetchWeatherData(coords.latitude, coords.longitude);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    // Cargar datos del clima al montar el componente
    loadWeatherData();
  }, []);

  return (
    <div className="flex justify-center mb-2">
      <form onSubmit={onSubmit} action="">
        <div className="flex flex-col justify-center mx-auto mb-4 m-2">
          <div className="flex justify-center items-center text-lg mb-4">
            <IoHomeOutline className="text-[50px] mr-4" />
            <div className="flex justify-center flex-col">
              <p>Local weather:</p>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                weatherLocation && (
                  <>
                    <p>Location: {weatherLocation.name}</p>
                    <p>Temp: {(weatherLocation.main.temp - 273.15).toFixed(1)}°C </p>
                    <p>
                      Wind speed: {(weatherLocation.wind.speed * 4.82).toFixed(1)} km/h
                    </p>
                  </>
                )
              )}
            </div>
          </div>

          <div className="flex flex-row">
            <input
              className="w-full text-black rounded-lg pl-4"
              type="text"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              className="text-black py-2 px-4 ml-1 h-10 rounded-lg w-1/2 bg-[#1d335b] hover:bg-[#2d497c]"
              type="submit"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export { Form };
