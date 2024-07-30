import React, { useState, useEffect } from 'react';
import CardConsume from './CardConsume';
import CardGenerated from './CardGenerated';
import CardEnergy from './CardEnergy';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from "../../store/index";

interface Data {
  today_eq: number;
  reflux_station_data: {
    pv_power: number;
    meter_b_in_eq: number;
    self_eq: number;
  };
}

const Container: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  
  useEffect(() => {
    const fetchData = async () => {
      if (userRedux !== null) {
        try {
          const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
          const request = await axios.post(`${apiUrl}/api/real-time-data`, {
            user_name: userRedux[0].username,
          });
          const response = request.data.data;
          setData(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [userRedux]);

  const calculateEnergyData = (data: Data | null) => {
    if (data) {
      const energyGenerated = (data.today_eq / 1000).toFixed(2);
      const energyGenerating = data.reflux_station_data.pv_power;
      const consumedCalculate = ((data.reflux_station_data.meter_b_in_eq / 1000) + (data.reflux_station_data.self_eq / 1000)).toFixed(2);
      const tokens = Math.floor(data.today_eq / 1000).toString();
      return { energyGenerated, energyGenerating, consumedCalculate, tokens };
    }
    return { energyGenerated: "0.00", energyGenerating: "0", consumedCalculate: "0.00", tokens: "0" };
  };

  const { energyGenerated, energyGenerating, consumedCalculate, tokens } = calculateEnergyData(data);

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-2 justify-center graficos items-center">
      <CardGenerated total={energyGenerated} moment={energyGenerating} />
      <CardConsume supply={consumedCalculate} />
      <CardEnergy supply={tokens} />
    </div>
  );
};

export default Container;
