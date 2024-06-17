import React, { useState, useEffect } from 'react';
import CardConsume from './CardConsume';
import CardGenerated from './CardGenerated';
import CardEnergy from './CardEnergy';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from "../../store/index";

const Container = () => {
  const [data, setData] = useState(null);
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);

  const fetchData = async () => {
    try {
      const request = await axios.post('http://localhost:5100/api/real-time-data', {
        "user_name": userRedux[0].username
      });
      const response = request.data.data;
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {

      fetchData();

  }, []);

  // Energy conversion calculations based on `data`
  const energyGenerated = data ? (data.today_eq / 1000).toFixed(2) : "0.00";
  const energyGenerating = data && data.reflux_station_data ? data.reflux_station_data.pv_power : "0";
  const consumedCalculate = data ? ((data.reflux_station_data.meter_b_in_eq / 1000) + (data.reflux_station_data.self_eq / 1000)) : 0;
  const totalConsumed = consumedCalculate.toFixed(2);
  const tokens = data ? Math.floor(data.today_eq / 1000) : "0";

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-2 justify-center graficos items-center">
      <CardGenerated total={energyGenerated} moment={energyGenerating} />
      <CardConsume supply={totalConsumed} />
      <CardEnergy supply={tokens} />
    </div>
  );
};

export default Container;
