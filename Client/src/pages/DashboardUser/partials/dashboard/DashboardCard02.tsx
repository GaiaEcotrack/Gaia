import React , {useEffect , useState} from 'react';
import LineChart from '../../charts/LineChart01';
import { useSelector } from "react-redux";
import { RootState } from '../../../../store/index';


// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';
import SendVaras from '../../components/SendVaras';

function DashboardCard02({image,quantity,name,onClick,metric}) {
  const [card, setCard] = useState(false)
  const [claim, setClaim] = useState(false)
  const userRedux = useSelector((state:RootState) => state.app.loggedInUser)
  const membresia = userRedux?.[0].membresia
  
  useEffect(() => {
    if (membresia === true) {
      setClaim(true)
      
    }
  else{
    setClaim(false)
  }

  }, [membresia])

  const openCard = ()=>{
    setCard(true)
  }
  const close = ()=>{
    setCard(false)
  }
  

  const chartData = {
    labels: [
      '12-01-2020', '01-01-2021', '02-01-2021',
      '03-01-2021', '04-01-2021', '05-01-2021',
      '06-01-2021', '07-01-2021', '08-01-2021',
      '09-01-2021', '10-01-2021', '11-01-2021',
      '12-01-2021', '01-01-2022', '02-01-2022',
      '03-01-2022', '04-01-2022', '05-01-2022',
      '06-01-2022', '07-01-2022', '08-01-2022',
      '09-01-2022', '10-01-2022', '11-01-2022',
      '12-01-2022', '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: [
          622, 622, 426, 471, 365, 365, 238,
          324, 288, 206, 324, 324, 500, 409,
          409, 273, 232, 273, 500, 570, 767,
          808, 685, 767, 685, 685,
        ],
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
      // Gray line
      {
        data: [
          732, 610, 610, 504, 504, 504, 349,
          349, 504, 342, 504, 610, 391, 192,
          154, 273, 191, 191, 126, 263, 349,
          252, 423, 622, 470, 532,
        ],
        borderColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.slate[500])}, 0.25)`,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.slate[500])}, 0.25)`,
        pointHoverBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.slate[500])}, 0.25)`,
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };

  
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src={image} width="42" height="42" alt="Icon 02" />
          {/* Menu button */}
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{name}</h2>
        <h1 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2'>Profit in VARAS</h1>
        {claim && (
                  <button onClick={openCard} aria-describedby="tier-starter" className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-white rounded-full nline-flex hover:bg-transparent hover:border-white hover:text-black focus:outline-none focus-visible:outline-white text-sm focus-visible:ring-white">
                  Claim Varas
                </button>
        )}
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Balance</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">${quantity}</div>
          <div className="text-sm font-semibold text-white px-1.5 bg-amber-500 rounded-full">{metric}%</div>
        </div>
        {card && (
          <SendVaras close={close}/>
        )}
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] max-h-[128px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard02;
