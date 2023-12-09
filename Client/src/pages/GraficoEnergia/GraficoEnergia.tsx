/* eslint-disable */

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
import { Pie, Bar, Doughnut } from "react-chartjs-2";
// React Hooks
import { useState, useEffect } from "react";
// React Router
import { NavLink } from "react-router-dom";
// Funciones de formato de fecha
import { format } from "date-fns";
// Vara
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { decodeAddress, ProgramMetadata, GearKeyring } from "@gear-js/api";
// Componentes personalizados
import { ModalMintGaia } from "components/ModalMintGaia/ModalMintGaia";
// Auth

import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
// Imágenes
import PolygonDown from "../../assets/PolygonDown.svg";
import { WeatherNavbar } from "components/WeatherNavbar/WeatherNavbar";
import { WeatherPanel } from "components/WeatherNavbar/WeatherPanel";
// import { SideBarNew } from "components/SideBarNew/SideBarNew";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const dataPie: ChartData<"doughnut", number[], string> = {
  labels: ["Wind Energy", "Thermal Energy", "Solar Energy"],
  datasets: [
    {
      type: "doughnut",
      data: [10000, 7000, 3000],
      backgroundColor: ["#699CD0", "#74C7ED", "#F0B778"],
    },
  ],
};

const optionsPie = {
  responsive: true,
  maintainAspectRatio: false,
  color: 'white',
};


const optionsBar = {
  responsive: true,
  color: 'white',
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

const GraficoEnergia = () => {  
  
  
  const [componenteMontado, setComponenteMontado] = useState(true);
  const [excedenteCapturado, setExcedenteCapturado] = useState<number | null>(
    null
  );
  const [convertirToken, setConvertirToken] = useState(0)
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
        label: "Energy values",
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
  const handleCaptureExcedente = () => {
    const excedente = Math.floor(
      calcularExcedente(totalGenerado, totalConsumido) * 10
    );
    setExcedenteCapturado(excedente);
  };
  handleCaptureExcedente()
}, [totalGenerado, totalConsumido, excedenteCapturado]);

const handleCaptureExcedente = () => {
  const excedente = Math.floor(
    calcularExcedente(totalGenerado, totalConsumido) * 10
  );
  setExcedenteCapturado(excedente);
};



//-------------------------------------------------------------------VARA INTEGRATION
const alert = useAlert();
const { accounts, account } = useAccount();
const { api } = useApi();
// Add your programID
const programIdKey = process.env.REACT_APP_PROGRAM_ID

// Add your metadata.txt
 const meta = process.env.REACT_APP_META_DATA
 const MidWallet = process.env.REACT_APP_MID_KEY
 const addresLocal = account?.address



 if(addresLocal !== undefined && meta !== undefined && MidWallet !== undefined){
   
 const programIDFT = programIdKey

 const metadata = ProgramMetadata.from(meta);

  const gasLimit = 375076928
  const percentage = 0.90
  const gasTotal = gasLimit * (1+percentage)
  const gasUsage = Math.round(gasTotal)
 
 const messageTwo: any = {
   destination: programIDFT, // programId
   payload: {
     transfer: [
       decodeAddress(MidWallet),
       decodeAddress(addresLocal),
       5,
     ],
   },
   gasLimit: gasUsage,
   value: 0,
 };
 
 const signerTwo = async () => {
   const localaccount = account?.address;
   const isVisibleAccount = accounts.some(
     (visibleAccount) => visibleAccount.address === localaccount
   );
 
   if (isVisibleAccount) {
     // Create a message extrinsic
     const transferExtrinsic = await api.message.send(messageTwo, metadata);
     // const mnemonic = 'hub next valid globe toddler robust click demise silent pottery inside brass';
     const keyring = await GearKeyring.fromSuri('//Alice');
 
     await transferExtrinsic.signAndSend(keyring,(event:any)=>{
         console.log("transferencia a la cuenta local hecha");
         
         
     })
   } else {
     alert.error("Account not available to sign");
   }
 };
 
 
 
 useEffect(() => {
  const ejecutarFirmantes = async () => {
    // Verificar si account.address no es undefined
    if (account?.address !== undefined) {
      await signerTwo();
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  };

  // Inicia el bucle cuando el componente se monta y account.address no es undefined
  if (componenteMontado && account?.address !== undefined) {
    ejecutarFirmantes();
  }

  // Limpia el bucle cuando el componente se desmonta
  return () => {
    setComponenteMontado(false);
  };
}, [componenteMontado, account?.address]); 
 }

 if (addresLocal !== undefined && meta !== undefined && MidWallet !== undefined) {
  // Resto del código
} else {
  // Muestra un alert de error ya que addresLocal es undefined
  alert.error("Error: No se encuentra conectado a la wallet");
}

//------------------------------VARA INTEGRATION-----------------------------------------------------------------------


  return (
    <div className="mb-12">
      <div className=" text-white md:pl-24 2xl:pl-32 md:pr-10 md:pb-0">
       
        <div className="flex flex-col lg:flex-row  p-2 justify-center graficos items-center">
          <div className="flex flex-col bg-[#1d335b]  md:w-[380px] w-[380px] justify-center h-[170px]   rounded overflow-hidden shadow-lg  m-4">
            <div className=" flex justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center mt-4">
                {totalGenerado.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-20">
              <span className=" mb-4 mr-4">Total generated</span>
            </div>
          </div>
          <div className="flex flex-col bg-[#1d335b] md:w-[380px] w-[380px] justify-center h-[170px] rounded overflow-hidden shadow-lg  m-4">
            <div className="flex justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center mt-4">
                {totalConsumido.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-20">
              <span className=" mb-4 mr-4">
                Total consumed
              </span>
            </div>
          </div>
          <div className="flex flex-col bg-[#1d335b] md:w-[380px] w-[380px] justify-center h-[170px] rounded overflow-hidden shadow-lg  m-4">
            <div className="flex flex-col justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center mt-8">
                {totalExcedente.toFixed(3)} Kw
              </span>
             

              {/* <button
                type="button"
                className="text-[#338de7] text-[18px] underline text-left"
                onClick={() => {setModalMint(true); handleCaptureExcedente()}}
              >
                Convertir a Token
              </button> */}
            </div>
            <div className="flex justify-end items-end h-20">
            <img src="./LOGOGAIASOLO.PNG"  className="w-16 h-16 mr-8 mb-2"  alt="" />
              <span className=" mb-4 mr-4 font-bold text-white">
                Total surplus tokens: 
              </span>
              <h2 className="mb-4 mr-4 font-bold text-emerald-400">{excedenteCapturado}</h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col p-2 mb-6 md:ml-10 justify-center items-center md:items-start">
            <button type="button" className="cursor-not-allowed pointer-events-none  text-[18px] mt-4 md:mt-0 text-center md:text-left">
              Generation Panel
            </button>
            <NavLink to="/panelUsuarioFinal">
              <button type="button" className=" text-[18px] underline mt-4 md:mt-0 text-center md:text-left">
                Device Manage
              </button>
            </NavLink>
            <button
              type="button"
              className=" text-[18px] underline mt-4 md:mt-0 text-center md:text-left"
              onClick={openPopup}
            >
              Create Alerts
            </button>
            {popupOpen && <PopUpALert onClose={closePopup} />}
          </div>        

        <div className="justify-center mb-10">
          <Doughnut
            className="h-[300px] 2xl:h-[400px] justify-center "
            data={dataPie}
            options={optionsPie}
          />
        </div>        

        <div className="flex flex-col items-center sm:flex-row sm:justify-center">
        <div className="relative inline-block">
        <select
          className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] text-white m-1 pl-2"
          defaultValue="Energia Solar"
          onChange={(e) => console.log(e.target.value)} // Puedes manejar la selección aquí
        >
          <option value="Energia Solar">Solar Energy</option>
          <option value="Energia Termica">Thermal Energy</option>
          <option value="Energia Eolica">Wind Energy</option>
        </select>
        {/* <img src={PolygonDown} alt="" className="ml-2" /> */}
      </div>
          <button type="button" className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] m-1">
            Generated
            <img src={PolygonDown} alt="" className="ml-2" />
          </button>
          <button type="button" className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] m-1">
            Real Time
            <img src={PolygonDown} alt="" className="ml-2" />
          </button>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-center sm:flex-row">
            <div className="flex flex-col items-center mb-2 sm:mb-0">
              <span className=" text-[16px] font-[700]">
                0 Kws
              </span>
              <h3 className=" ml-2 p-2">Current</h3>
            </div>
            <div className="flex flex-col items-center mb-2 sm:mb-0 sm:ml-4">
              <span className="t text-[16px] font-[700]">
                0 Kws
              </span>
              <h3 className="t ml-2 p-2">Basic</h3>
            </div>
            <div className="flex flex-col items-center mb-2 sm:mb-0">
              <span className=" text-[16px] font-[700]">
                0 Kws
              </span>
              <h3 className=" ml-2 p-2">Total</h3>
            </div>          
          </div>
        </div>

        <div className="lg:absolute lef-[50%] lg:top-[15%] 2xl:top-[20%] lg:left-[76%] 2xl:left-[78%] laptop">
        <WeatherNavbar/>
        <WeatherPanel/>
        </div>

        <div className="flex mx-auto max-w-screen-md h-[200px] mt-8">
          <Bar data={barData} options={optionsBar} />
          <div className="border-4 mt-10 xl:ml-32 bg-gray-100 h-32 rounded-full hidden lg:flex items-center justify-center border-gray-400">
            <p className="text-[#1d335b] text-xl m-2 text-center">{showDate}</p>
          </div>
        </div>
      </div>

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