import { ApiLoader } from "../../components/loaders/api-loader/ApiLoader";

interface CardProps {
  loadingData: any;
  showData: any;
  weather: any;
  forecast: any;
}



function Card({ loadingData, showData, weather, forecast }: CardProps) {
   

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = `${day}/${month}/${year}`;
  let url = "";
  let iconUrl = "";

  if (loadingData) {
    return <ApiLoader />;
  }
  if (showData) {
    url = "http://openweathermap.org/img/w/";
    iconUrl = `${url}${weather.weather[0].icon}.png`;

    iconUrl3 = `${url}${forecast.list[1].weather[0].icon}.png`;
    iconUrl6 = `${url}${forecast.list[2].weather[0].icon}.png`;
    iconUrl9 = `${url}${forecast.list[3].weather[0].icon}.png`;

    forecastDate3 = `${forecast.list[1].dt_txt.substring(
      8,
      10
    )}/${forecast.list[1].dt_txt.substring(
      5,
      7
    )}/${forecast.list[1].dt_txt.substring(
      0,
      4
    )}/${forecast.list[1].dt_txt.substring(11, 13)}`;
    forecastDate6 = `${forecast.list[2].dt_txt.substring(
      8,
      10
    )}/${forecast.list[2].dt_txt.substring(
      5,
      7
    )}/${forecast.list[2].dt_txt.substring(
      0,
      4
    )}/${forecast.list[2].dt_txt.substring(11, 13)}`;
    forecastDate9 = `${forecast.list[3].dt_txt.substring(
      8,
      10
    )}/${forecast.list[3].dt_txt.substring(
      5,
      7
    )}/${forecast.list[1].dt_txt.substring(
      0,
      4
    )}/${forecast.list[3].dt_txt.substring(11, 13)}`;
  }

 

  return (
    <div>
      {showData === true ? (
        <div className="flex">
          <div className="mb-4 mx-auto bg-[#1d335b] rounded-lg">
            <div className="flex flex-row justify-center">
              {/* Tarjeta Principal */}
              <div className="group hover:-rotate-0 [transform:rotate3d(1_,-1,_1,_15deg)] duration-500 overflow-hidden bg-gradient-to-bl from-sky-400 via-sky-500 to-sky-700 p-6 rounded-lg hover:shadow-lg [box-shadow:12px_12px_0px_0px_#0d0d0d] backdrop-filter backdrop-blur-md border border-neutral-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {weather.name}
                    </h2>
                    {/* <p className="text-neutral-800">Sunny</p> */}
                  </div>
                  <p className="text-black">
                    <img src={iconUrl} alt="" />
                    {forecast.list[0].description}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-white">
                    {(forecast.list[1].main.temp - 273.15).toFixed(1)}
                  </p>
                  <div className="flex items-center justify-between gap-1" />
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-neutral-800">
                      Wind: {(weather.wind.speed * 4.82).toFixed(1)} km/h
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-neutral-800">Temp</span>
                    <span className="text-white">
                      {(weather.main.temp - 273.15).toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-neutral-800">Date</span>
                    <span className="text-white">{date}</span>
                  </div>
                </div>
              </div>

              {/* Tres tarjetas adicionales */}

              <hr />
              {/* <div>
                  <h2 className="text-black">Próximas horas:</h2> <br />
                  <p className="text-black">{forecastDate3}h</p>
                  <p className="text-black">
                    <img src={iconUrl3} alt="" />
                    {forecast.list[1].weather[0].description}
                  </p>
                  <p className="text-black">
                    {(forecast.list[1].main.temp - 273.15).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-black">{forecastDate6}h</p>
                  <p className="text-black">
                    <img src={iconUrl6} alt="" />
                    {forecast.list[2].weather[0].description}
                  </p>
                  <p className="text-black">
                    {(forecast.list[2].main.temp - 273.15).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-black">{forecastDate9}h</p>
                  <p className="text-black">
                    <img src={iconUrl9} alt="" />
                    {forecast.list[3].weather[0].description}
                  </p>
                  <p className="text-black">
                    {(forecast.list[3].main.temp - 273.15).toFixed(1)}
                  </p>
                </div> */}
            </div>
          </div>
        </div>
      ) : (
        <h2 className="text-center"> &nbsp;</h2>
      )}
    </div>
  );
}

export { Card };
