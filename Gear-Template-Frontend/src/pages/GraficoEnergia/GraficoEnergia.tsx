// Librerías de gráficos
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
// Gráficos de React
import { Pie, Bar } from "react-chartjs-2";
// React Hooks
import { useState, useEffect } from "react";
// React Router
import { NavLink } from "react-router-dom";
// Funciones de formato de fecha
import { format } from "date-fns";
// Componentes personalizados
import { ModalMintGaia } from "components/ModalMintGaia/ModalMintGaia";

import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
// Imágenes
import PolygonDown from "../../assets/PolygonDown.svg";
import { getAuth, signOut } from 'firebase/auth';

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
/* eslint-disable */

export interface IHomePageProps {}

const GraficoEnergia: React.FunctionComponent<IHomePageProps> = (props) => {

  const auth = getAuth();
  
  const [excedenteCapturado, setExcedenteCapturado] = useState<number | null>(
    null
  );
  const [modalMint, setModalMint] = useState<boolean>(false)
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


  useEffect(() => {
    // Recuperar valores desde localStorage
    const storedTotalGenerado = JSON.parse(localStorage.getItem("totalGenerado") || "0");
    const storedTotalConsumido = JSON.parse(localStorage.getItem("totalConsumido") || "0");
    const storedTotalExcedente = JSON.parse(localStorage.getItem("totalExcedente") || "0");

    // Eestados con los valores recuperados
    setTotalGenerado(storedTotalGenerado);
    setTotalConsumido(storedTotalConsumido);
    setTotalExcedente(storedTotalExcedente);
  }, []); // Se ejecuta solo al montar el componente
 

  useEffect(() => {
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

      localStorage.setItem("totalGenerado", JSON.stringify(totalGenerado));
      localStorage.setItem("totalConsumido", JSON.stringify(totalConsumido));
      localStorage.setItem("totalExcedente", JSON.stringify(totalExcedente));
    };
    
    const intervalId = setInterval(updateBarChart, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, [barData]);

  const currentDate = new Date();

  const showDate = format(currentDate, "dd/MM/yyyy HH:mm");



useEffect(() => {
  const intervalId = setInterval(
    () => setTotalGenerado((prevTotalGenerado) => prevTotalGenerado + 0.01),
    1000
  );

  return () => clearInterval(intervalId);
}, []);

useEffect(() => {
  const intervalId = setInterval(() => {
    setTotalConsumido((prevTotalConsumido) => prevTotalConsumido + 0.005);
  }, 7000);

  return () => clearInterval(intervalId);
}, []);

const calcularExcedente = (totalGenerado: number, totalConsumido: number) =>
  Math.max(totalGenerado - totalConsumido, 0);

useEffect(() => {
  if (totalConsumido < totalGenerado) {
    setTotalExcedente(calcularExcedente(totalGenerado, totalConsumido));
  } else {
    setTotalExcedente(0);
  }
}, [totalGenerado, totalConsumido]);

const handleCaptureExcedente = () => {
  const excedente = Math.floor(
    calcularExcedente(totalGenerado, totalConsumido) * 10
  );
  setExcedenteCapturado(excedente);
};

  return (
    <div className="w-full">
      <div className="bg-slate-200 md:pl-24 2xl:pl-32 md:pr-10 md:pb-0 ">
        <div className="flex flex-col md:flex-row  p-2 justify-center graficos">
          <div className="bg-white ms:w-228 ] md:w-[349px] h-[170px]  rounded overflow-hidden shadow-lg flex flex-col m-4">
            <div className="flex justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center text-[#0487F2] mt-4">
                {totalGenerado.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-20">
              <span className="text-[#A7A4B2E0] mb-4 mr-4">Total Generado</span>
            </div>
          </div>
          <div className="bg-white ms:w-228 md:w-[349px] h-[170px] rounded overflow-hidden shadow-lg flex flex-col m-4">
            <div className="flex justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center text-[#0487F2] mt-4">
                {totalConsumido.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-20">
              <span className="text-[#A7A4B2E0] mb-4 mr-4">
                Total Consumido
              </span>
            </div>
          </div>
          <div className="bg-white ms:w-228 md:w-[349px] h-[170px] rounded overflow-hidden shadow-lg flex flex-col m-4">
            <div className="flex flex-col justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center text-[#0487F2] mt-8">
                {totalExcedente.toFixed(3)} Kw
              </span>
              <button
                type="button"
                className="text-[#699CD0] text-[18px] underline text-left"
                onClick={() => {setModalMint(true); handleCaptureExcedente()}}
              >
                Convertir a Token
              </button>
            </div>
            <div className="flex justify-end items-end h-20">
              <span className="text-[#A7A4B2E0] mb-4 mr-4">
                Total Excedente
              </span>
            </div>
          </div>

          <div className="flex flex-col p-2 mb-6 md:ml-10 justify-center items-center md:items-start">
            <button type="button" className="cursor-not-allowed pointer-events-none text-[#699CD0] text-[18px] mt-4 md:mt-0 text-center md:text-left">
              Panel de generación y consumo
            </button>
            <NavLink to="/panelUsuarioFinal">
              <button type="button" className="text-[#699CD0] text-[18px] underline mt-4 md:mt-0 text-center md:text-left">
                Administrar Dispositivos.
              </button>
            </NavLink>
            <button
              type="button"
              className="text-[#699CD0] text-[18px] underline mt-4 md:mt-0 text-center md:text-left"
              onClick={openPopup}
            >
              Crear Alertas
            </button>
            {popupOpen && <PopUpALert onClose={closePopup} />}
          </div>
        </div>

        <div className="justify-center mb-10">
          <Pie
            className="h-[300px] 2xl:h-[400px] justify-center"
            data={dataPie}
            options={optionsPie}
          />
        </div>

        <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        <div className="relative inline-block">
        <select
          className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-neutral-50 rounded-[15px] text-[#857D7D] m-1"
          defaultValue="Energia Solar"
          onChange={(e) => console.log(e.target.value)} // Puedes manejar la selección aquí
        >
          <option value="Energia Solar">Energia Solar</option>
          <option value="Energia Termica">Energia Termica</option>
          <option value="Energia Eolica">Energia Eolica</option>
        </select>
        {/* <img src={PolygonDown} alt="" className="ml-2" /> */}
      </div>
          <button type="button" className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-neutral-50 rounded-[15px] text-[#857D7D] m-1">
            Generado
            <img src={PolygonDown} alt="" className="ml-2" />
          </button>
          <button type="button" className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-neutral-50 rounded-[15px] text-[#857D7D] m-1">
            Tiempo real
            <img src={PolygonDown} alt="" className="ml-2" />
          </button>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-center sm:flex-row">
            <div className="flex flex-col items-center mb-2 sm:mb-0">
              <span className="text-[#857D7D] text-[16px] font-[700]">
                0 Kws
              </span>
              <h3 className="text-[#857D7D] ml-2 p-2">Actual</h3>
            </div>
            <div className="flex flex-col items-center mb-2 sm:mb-0 sm:ml-4">
              <span className="text-[#857D7D] text-[16px] font-[700]">
                0 Kws
              </span>
              <h3 className="text-[#857D7D] ml-2 p-2">Basico</h3>
            </div>
            <div className="flex flex-col items-center mb-2 sm:mb-0">
              <span className="text-[#857D7D] text-[16px] font-[700]">
                0 Kws
              </span>
              <h3 className="text-[#857D7D] ml-2 p-2">Total</h3>
            </div>
            <br />
          </div>
        </div>

        <div className="flex mx-auto max-w-screen-md h-[200px] mt-8">
          <Bar data={barData} options={optionsBar} />
          <div className="border-4 m-auto ml-32 bg-gray-100 h-32 rounded-full hidden lg:flex items-center justify-center border-gray-300">
            <p className="text-gray-400 text-xl m-2 text-center">{showDate}</p>
          </div>
        </div>
      </div>

      <button onClick={() => signOut(auth)}>Sign out of Firebase</button>
  
      <ModalMintGaia 
      modalMint={modalMint} 
      setModalMint={setModalMint}
      excedenteCapturado={excedenteCapturado}
      setTotalGenerado={setTotalGenerado}
      setTotalConsumido={setTotalConsumido}/>
    </div>
  );
}

export default GraficoEnergia;