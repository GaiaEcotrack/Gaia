import {
  Chart as ChartJS,
  ChartData,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { format } from "date-fns";

import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
import PolygonDown from '../../assets/PolygonDown.svg'
import { MintGaia } from "pages/home/MintGaia";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const dataPie: ChartData<"pie", number[], string> = {
  labels: ["Energia Eólica", "Energia Térmica", "Energia Solar"],
  datasets: [
    {
      type: "pie",
      data: [10000, 7000, 3000],
      backgroundColor: ["#699CD0", "#74C7ED", "#F0B778"],
    },
  ],
};

const optionsPie = {
  responsive: true,
  maintainAspectRatio: false,
};

// const dataBar = {
//   labels: ['', '', '', '', '', '', '', '', '', '', ''], // esta data vendria de Vara network
//   datasets: [
//     {
//       type: 'bar',
//       label: 'Valores de energía',
//       data: [7000, 5000, 2000, 500, 9000, 1000, 4000, 9000, 3500, 2000, 5000, 700],
//       backgroundColor: ['#74C7ED', '#F37B7B', '#699CD0'],
//       barThickness: 50,
//       // maxBarThickness: 50,
//     },
//   ],
// };

const optionsBar = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      beginAtZero: true,
      max: 15000,
    },
  },
  elements: {
    bar: {
      borderRadius: [10],
    },
  },
};

export function GraficoEnergia () {
  
  const [excedenteCapturado, setExcedenteCapturado] = useState<number | null>(null);
  const [totalGenerado, setTotalGenerado] = useState<number>(0);
  const [totalConsumido, setTotalConsumido] = useState<number>(0);
  const [totalExcedente, setTotalExcedente] = useState<number>(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [barData, setBarData] = useState<ChartData<"bar", number[], string>>({
    labels: ["", "", "", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        type: "bar",
        label: "Valores de energía",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ["#74C7ED", "#F37B7B", "#699CD0"],
        barThickness: 25,
      },
    ],
  });

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  // const fetchData = async () => {
  //   try {
  //     const response = await fetch("src/pages/GraficoEnergia/data.json");
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     return null;
  //   }
  // };

  const updateBarChart = () => {
    const newData = Array.from({ length: 12 }, () =>
      Math.floor(Math.random() * 15001)
    );

    const newBarData = {
      ...barData,
      datasets: [
        {
          ...barData.datasets[0],
          data: newData,
        },
      ],
    };

    setBarData(newBarData);
  };

  useEffect(() => {
    const intervalId = setInterval(updateBarChart, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const currentDate = new Date();

  const showDate = format(currentDate, "dd/MM/yyyy HH:mm");

  // contador de total generado de Kw
  useEffect(() => {
    const intervalId = setInterval(() => setTotalGenerado(prevTotalGenerado => prevTotalGenerado + 0.01), 1000);  
  
  return () => clearInterval(intervalId);
  }, []);
  // contador de total consumido de Kw
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTotalConsumido((prevTotalConsumido) => prevTotalConsumido + 0.005);
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

   // calcula excdente energia Kw
   const calcularExcedente = (totalGenerado: number, totalConsumido: number) =>
   Math.max(totalGenerado - totalConsumido, 0);   

  //  console.log(calcularExcedente(totalGenerado, totalConsumido));

 useEffect(() => {
   // Calcula el excedente solo si totalConsumido es menor que totalGenerado
   if (totalConsumido < totalGenerado) {
     setTotalExcedente(calcularExcedente(totalGenerado, totalConsumido));
   } else {
     setTotalExcedente(0);
   }
 }, [totalGenerado, totalConsumido]);

 const handleCaptureExcedente = () => {
  const excedente = Math.floor(calcularExcedente(totalGenerado, totalConsumido) * 10);
  console.log(`Valor actual de excedente: ${excedente}`);
  setExcedenteCapturado(excedente);
};

  return (
    <div className="w-full ">
      <section className="bg-white md:p-8">
        <div className="flex flex-col md:flex-row  p-2 justify-center">
          <div className=" ms:w-228 ] md:w-[349px] h-[203px]  rounded overflow-hidden shadow-lg flex flex-col m-4">
          <div className="flex justify-center items-center h-full">
      <span className="font-[600] text-[40px] text-center text-[#0487F2] mt-auto">
                {totalGenerado.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-full">
              <span className="text-[#A7A4B2E0] mb-4 mr-4">Total Generado</span>
            </div>
          </div>
          <div className="ms:w-228 md:w-[349px] h-[203px] rounded overflow-hidden shadow-lg flex flex-col m-4">
    <div className="flex justify-center items-center h-full">
      <span className="font-[600] text-[40px] text-center text-[#0487F2] mt-auto">
                {totalConsumido.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-full">
              <span className="text-[#A7A4B2E0] mb-4 mr-4">
                Total Consumido
              </span>
            </div>
          </div>
          <div className="ms:w-228 md:w-[349px] h-[203px] rounded overflow-hidden shadow-lg flex flex-col m-4">
    <div className="flex justify-center items-center h-full">
      <span className="font-[600] text-[40px] text-center text-[#0487F2] mt-auto">
                {totalExcedente.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-full">
              <span className="text-[#A7A4B2E0] mb-4 mr-4">
                Total Excedente
              </span>
            </div>
          </div>

          <div className="flex flex-col p-2 mb-24 md:ml-10 items-center md:items-start">
  <button className="text-[#699CD0] text-[18px] underline mt-4 md:mt-0 text-center md:text-left">
    Panel de generación y consumo
  </button>
  <NavLink to="/panelUsuarioFinal">
    <button className="text-[#699CD0] text-[18px] underline mt-4 md:mt-0 text-center md:text-left">
      Administrar Dispositivos.
    </button>
  </NavLink>
  <button
    className="text-[#699CD0] text-[18px] underline mt-4 md:mt-0 text-center md:text-left"
    onClick={openPopup}
  >
    Crear Alertas
  </button>
  {popupOpen && <PopUpALert onClose={closePopup} />}
</div>
</div>



        <button
          type="button"
          className="text-[#699CD0] text-[18px] underline mt-4 text-left"
          onClick={handleCaptureExcedente}
        >
          Convertir a TOKENS
        </button>




        <div className="justify-center h-96 mb-24">
          <Pie
            className="w-[400px] h-[400px] justify-center"
            data={dataPie}
            options={optionsPie}
          />
        </div>

        <div className="mt-12 flex flex-col items-center sm:flex-row sm:justify-center">
  <button className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-neutral-100 rounded-[15px] text-[#857D7D] m-1">
    Energia Solar
    <img src={PolygonDown} alt="" className="ml-2" />
  </button>
  <button className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-neutral-100 rounded-[15px] text-[#857D7D] m-1">
    Generado
    <img src={PolygonDown} alt="" className="ml-2" />
  </button>
  <button className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-neutral-100 rounded-[15px] text-[#857D7D] m-1">
    Tiempo real
    <img src={PolygonDown} alt="" className="ml-2" />
  </button>

  <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-center sm:flex-row">
    <div className="flex items-center mb-2 sm:mb-0">
      <span className="text-[#857D7D] text-[16px] font-[700]">0 Kws</span>
      <p className="text-[#857D7D] ml-2">Actual</p>
    </div>
    <div className="flex items-center mb-2 sm:mb-0 sm:ml-4">
      <span className="text-[#857D7D] text-[16px] font-[700]">0 Kws</span>
      <p className="text-[#857D7D] ml-2">Basico</p>
    </div>
    <div className="flex items-center">
      <span className="text-[#857D7D] text-[16px] font-[700]">0 Kws</span>
      <p className="text-[#857D7D] ml-2">Total</p>
    </div>
    <br />
  </div>
</div>

<div className="flex mx-auto max-w-screen-md h-[200px]">
          <Bar data={barData} options={optionsBar} />
          <div className="border-4 m-auto ml-32 bg-gray-100 h-32 rounded-full hidden lg:flex items-center justify-center border-gray-300">
  <p className="text-gray-400 text-xl m-2 text-center">{showDate}</p>
</div>

        </div>
      </section>
        <MintGaia excedenteCapturado={excedenteCapturado}
        setTotalGenerado={setTotalGenerado}
        setTotalConsumido={setTotalConsumido} />
    </div>
  );
};
