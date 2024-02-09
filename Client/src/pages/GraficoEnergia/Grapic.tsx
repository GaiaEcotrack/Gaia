import React, { useState, useEffect } from 'react';
import Tooltip from '../../pages/DashboardUser/components/Tooltip';
import RealtimeChart from '../../pages/DashboardUser/charts/RealtimeChart';
import axios from 'axios';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../pages/DashboardUser/utils/Utils';

function DashboardCard05() {

  // Fake real-time data
  const [counter, setCounter] = useState(0);
  const [range, setRange] = useState(35);
  const [totalGenerado, setTotalGenerado] = useState(0); // Inicializa totalGenerado en 0

  // Generate fake dates from now to back in time
  const generateDates = () => {
    const now = new Date();
    const dates = [];
    Array.from({ length: range }, (_, i) => {
      dates.push(new Date(now - 2000 - i * 2000));
    });
    return dates.reverse();
  };

  const [slicedLabels, setSlicedLabels] = useState(generateDates());

  // Fetch energy data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchEnergy = async () => {
        try {
          const url = import.meta.env.VITE_APP_API_URL;
          const response = await axios.get(
            `${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Recent`
          );
          const data = response.data.set;
          const pvGeneration = data[0].pvGeneration;
          // Aumenta un poco el valor de pvGeneration aleatoriamente
          const increasedValue = parseFloat(pvGeneration) + (Math.random() - 0.5) * 0.3; // Ajusta el valor aquí
          setTotalGenerado(parseFloat(increasedValue.toFixed(2))); // Limitar a 2 decimales
          console.log(increasedValue);
        } catch (error) {
          console.log(error);
        }
      };
      fetchEnergy();
    }, 2000); // Fetch data every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Update fake date labels
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 2000);
    return () => clearInterval(interval)
  }, [counter]);

  useEffect(() => {
    setSlicedLabels(prevLabels => [...prevLabels, new Date()]);
    return () => setCounter(0); // Cambiar setIncrement por setCounter
  }, [counter]);

  const chartData = {
    labels: slicedLabels,
    datasets: [
      // Indigo line
      {
        data: Array.from({ length: slicedLabels.length }, () => totalGenerado), // Usar totalGenerado en lugar de data
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,          
        clip: 20,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-[#181745c0] shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
   
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;
