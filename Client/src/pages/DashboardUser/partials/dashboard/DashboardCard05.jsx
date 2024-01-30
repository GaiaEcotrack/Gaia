import React, { useState, useEffect } from 'react';
import Tooltip from '../../components/Tooltip';
import RealtimeChart from '../../charts/RealtimeChart';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

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
    7.81, 7.75, 5.48, 4.28, 3.14, 2.25, 1.04, 2.49, 5.49, 6.87,
    3.73, 6.42, 8.06, 5.62, 8.16, 5.22, 8.67, 0.18, 1.31, 3.25,
    5.91, 4.44, 5.97, 2.27, 0.96, 9.34, 5.07, 9.85, 3.79, 1.92,
    0.95, 9.65, 8.09, 9.81, 7.85, 9.52, 0.21, 2.22, 4.42, 3.42,
    0.91, 8.52, 3.37, 7.58, 9.09, 9.36, 8.71, 9.42, 5.93, 7.71,
    0.62, 6.28, 7.37, 3.08, 5.94, 5.82, 3.94, 2.65, 0.25,
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
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
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
