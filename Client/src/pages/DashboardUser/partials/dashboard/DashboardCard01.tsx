import React , {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/index';
import { LocalBalanceToken } from '@/pages/home/MyBalanceToken';
import LineChart from '../../charts/LineChart01';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard01({onClick}) {

  const chartData = {
    labels: [
      '12-01-2020',
      '01-01-2021',
      '02-01-2021',
      '03-01-2021',
      '04-01-2021',
      '05-01-2021',
      '06-01-2021',
      '07-01-2021',
      '08-01-2021',
      '09-01-2021',
      '10-01-2021',
      '11-01-2021',
      '12-01-2021',
      '01-01-2022',
      '02-01-2022',
      '03-01-2022',
      '04-01-2022',
      '05-01-2022',
      '06-01-2022',
      '07-01-2022',
      '08-01-2022',
      '09-01-2022',
      '10-01-2022',
      '11-01-2022',
      '12-01-2022',
      '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: [732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532],
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
        data: [532, 532, 532, 404, 404, 314, 314, 314, 314, 314, 234, 314, 234, 234, 314, 314, 314, 388, 314, 202, 202, 202, 202, 314, 720, 642],
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

  interface CryptoValues {
    gaia: any;
    vara: any;
  }
  
  interface PercentageChanges {
    gaia: number;
    vara: number;
  }

  
  
    const gaia = useSelector((state: RootState)=> state.app.valueGaia)
    const vara = useSelector((state: RootState)=> state.app.valueVara)
  
    // Función para calcular el valor total
    
  
    const [cantidad, setCantidad] = useState({
      gaia,
      vara,
    });
  
    const calcularValorTotal = (quantity: number, valorCrypto: number): number =>
    quantity * valorCrypto;
  
    const [valoresCrypto, setValoresCrypto] = useState<CryptoValues>({
      gaia: 0.126,
      vara: 50.50,
    });
    
    const totalGaia = calcularValorTotal(cantidad.gaia, valoresCrypto.gaia);
    const totalVara = calcularValorTotal(cantidad.vara, valoresCrypto.vara);
    
  
  
    const [porcentajesCambio, setPorcentajesCambio] = useState<PercentageChanges>(
      {
        gaia: 0,
        vara: 0,
      }
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const totalTokens = totalGaia + totalVara
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        // Simulamos cambios aleatorios en los porcentajes
        const nuevosPorcentajes: PercentageChanges = {
          gaia: Math.random() * 2 - 1,
          vara: Math.random() * 2 - 1,
        };
  
        setPorcentajesCambio(nuevosPorcentajes);
  
        // Actualizamos los valores de las criptomonedas acumulando los cambios
        setValoresCrypto((prevValores) => ({
          gaia: prevValores.gaia * (1 + nuevosPorcentajes.gaia / 100),
          vara: prevValores.vara * (1 + nuevosPorcentajes.vara / 100),
        }));
  
        // Calculamos el nuevo total
      }, 3000);
  
      return () => clearInterval(intervalId);
    }, [valoresCrypto.gaia, valoresCrypto.vara]);
    useEffect(() => {
      setCantidad((prevValores) => ({
        ...prevValores,
        gaia,
        vara,
      }));
    }, [gaia, vara]);
  

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Icon */}
          <img src="/LogoGaia.svg" width="32" height="32" alt="Icon 01" />
          {/* Menu button */}
          <button type="button" onClick={onClick} className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">Send</button>

        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Gaia</h2>
        <h1 className='text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2'>Tokens</h1>
        <LocalBalanceToken/>
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Balance</div>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">${totalGaia.toFixed(2)}</div>
          <div className="text-sm font-semibold text-white px-1.5 bg-emerald-500 rounded-full">{porcentajesCambio.gaia.toFixed(2)}%</div>
        </div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={389} height={128} />
      </div>
    </div>
  );
}

export default DashboardCard01;
