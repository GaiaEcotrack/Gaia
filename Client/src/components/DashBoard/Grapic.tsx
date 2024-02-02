import React, { useState, useEffect } from 'react';
import Tooltip from '../../pages/DashboardUser/components/Tooltip';
import RealtimeChart from '../../pages/DashboardUser/charts/RealtimeChart';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../pages/DashboardUser/utils/Utils';

function DashboardCard05() {

  // IMPORTANT:
  // Code below is for demo purpose only, and it's not covered by support.
  // If you need to replace dummy data with real data,
  // refer to Chart.js documentation: https://www.chartjs.org/docs/latest

  // Fake real-time data
  const [counter, setCounter] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [range, setRange] = useState(35);
  
  // Dummy data to be looped
  const data = [
    1.64, 1.78, 1.92, 1.57, 2.11, 2.25, 2.49, 1.63, 1.79, 2.43,
    1.87, 2.16, 1.88, 2.05, 2.16, 1.97, 2.43, 1.68, 1.82, 2.19,
    2.04, 1.64, 2.11, 1.92, 1.96, 2.34, 1.85, 2.36, 1.99, 2.03,
    2.26, 2.08, 1.9, 2.07, 2.33, 2.15, 1.66, 2.22, 1.78, 2.44,
    1.99, 1.67, 2.31, 1.73, 2.09, 2.05, 1.79, 1.64, 2.02, 1.57,
    2.14, 2.27, 1.71, 1.94, 2.13, 1.75, 1.88, 2.47,
];

  const [slicedData, setSlicedData] = useState(data.slice(0, range));

  // Generate fake dates from now to back in time
  const generateDates = () => {
    const now = new Date();
    const dates = [];
    data.forEach((v, i) => {
      dates.push(new Date(now - 2000 - i * 2000));
    });
    return dates;
  };

  const [slicedLabels, setSlicedLabels] = useState(generateDates().slice(0, range).reverse());

  // Fake update every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter + 1);
    }, 2000);
    return () => clearInterval(interval)
  }, [counter]);

  // Loop through data array and update
  useEffect(() => {
    setIncrement(increment + 1);
    if (increment + range < data.length) {
      setSlicedData(([x, ...slicedData]) => [...slicedData, data[increment + range]]);
    } else {
      setIncrement(0);
      setRange(0);
    }
    setSlicedLabels(([x, ...slicedLabels]) => [...slicedLabels, new Date()]);
    return () => setIncrement(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const chartData = {
    labels: slicedLabels,
    datasets: [
      // Indigo line
      {
        data: slicedData,
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
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Energy peaks</h2>
        <Tooltip className="ml-2">
          <div className="text-xs text-center whitespace-nowrap">approximate values </div>
        </Tooltip>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard05;
