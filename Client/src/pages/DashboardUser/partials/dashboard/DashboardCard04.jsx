import React from 'react';
import BarChart from '../../charts/BarChart01';

// Import utilities
import { tailwindConfig } from '../../utils/Utils';

function DashboardCard04() {

  const chartData = {
    labels: [
      '12-01-2020', '01-01-2021', '02-01-2021',
      '03-01-2021', '04-01-2021', '05-01-2021',
    ],
    datasets: [
      // Light blue bars
      {
        label: 'Direct',
        data: [
          800, 1600, 900, 1300, 1950, 1700,
        ],
        backgroundColor: tailwindConfig().theme.colors.blue[400],
        hoverBackgroundColor: tailwindConfig().theme.colors.blue[500],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
      // Blue bars
      {
        label: 'Indirect',
        data: [
          4900, 2600, 5350, 4800, 5200, 4800,
        ],
        backgroundColor: tailwindConfig().theme.colors.indigo[500],
        hoverBackgroundColor: tailwindConfig().theme.colors.indigo[600],
        barPercentage: 0.66,
        categoryPercentage: 0.66,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="text-3xl font-semibold text-slate-800 dark:text-slate-100">Your Wallets</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <div>
      <div className="flex flex-col sm:flex-row gap-5 p-2.5">
            <div className="sm:w-96 w-72 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
            
                <img className="relative object-cover w-full h-full rounded-xl" src="https://i.imgur.com/kGkSg1v.png"/>
                
                <div className="w-full px-8 absolute top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-light">
                                Name
                            </p>
                            <p className="font-medium tracking-widest">
                                Karthik P
                            </p>
                        </div>
                        <img className="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png"/>
                    </div>
                    <div className="pt-1">
                        <p className="font-light">
                            Card Number
                        </p>
                        <p className="font-medium tracking-more-wider">
                            ****  ****  ****  7632
                        </p>
                    </div>
                    <div className="pt-6 pr-6">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="font-light text-xs">
                                    Valid
                                </p>
                                <p className="font-medium tracking-wider text-sm">
                                    11/15
                                </p>
                            </div>
                            <div className="">
                                <p className="font-light text-xs text-xs">
                                    Expiry
                                </p>
                                <p className="font-medium tracking-wider text-sm">
                                    03/25
                                </p>
                            </div>
    
                            <div className="">
                                <p className="font-light text-xs">
                                    CVV
                                </p>
                                <p className="font-bold tracking-more-wider text-sm">
                                    ···
                                </p>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
    
            <div className="sm:w-96 w-72 h-56 m-auto bg-red-100 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-110">
                
                <img className="relative object-cover w-full h-full rounded-xl" src="https://i.imgur.com/Zi6v09P.png"/>
                
                <div className="w-full px-8 absolute top-8">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-light">
                                Name
                            </p>
                            <p className="font-medium tracking-widest">
                                Karthik P
                            </p>
                        </div>
                        <img className="w-14 h-14" src="https://i.imgur.com/bbPHJVe.png"/>
                    </div>
                    <div className="pt-1">
                        <p className="font-light">
                            Card Number
                        </p>
                        <p className="font-medium tracking-more-wider">
                            ***  ****  ****  7632
                        </p>
                    </div>
                    <div className="pt-6 pr-6">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="font-light text-xs">
                                    Valid
                                </p>
                                <p className="font-medium tracking-wider text-sm">
                                    11/15
                                </p>
                            </div>
                            <div className="">
                                <p className="font-light text-xs text-xs">
                                    Expiry
                                </p>
                                <p className="font-medium tracking-wider text-sm">
                                    03/25
                                </p>
                            </div>
    
                            <div className="">
                                <p className="font-light text-xs">
                                    CVV
                                </p>
                                <p className="font-bold tracking-more-wider text-sm">
                                    ···
                                </p>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard04;
