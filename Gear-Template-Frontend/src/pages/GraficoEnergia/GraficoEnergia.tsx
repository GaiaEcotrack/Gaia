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
// Vara
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { decodeAddress, ProgramMetadata, GearKeyring } from "@gear-js/api";
// Componentes personalizados
import { ModalMintGaia } from "components/ModalMintGaia/ModalMintGaia";

import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
// Imágenes
import PolygonDown from "../../assets/PolygonDown.svg";

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
export function GraficoEnergia() {
  const [componenteMontado, setComponenteMontado] = useState(true);
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
const programIDFT =
"0xd46f5f0fba63bff9a43f6d4cca46d09ef0955b024e1bb70851dad96391c69986";

// Add your metadata.txt
const meta =
"00010001000000000001030000000107000000000000000108000000a90b3400081466745f696f28496e6974436f6e66696700000c01106e616d65040118537472696e6700011873796d626f6c040118537472696e67000120646563696d616c73080108753800000400000502000800000503000c081466745f696f204654416374696f6e000118104d696e74040010011075313238000000104275726e040010011075313238000100205472616e736665720c011066726f6d14011c4163746f724964000108746f14011c4163746f724964000118616d6f756e74100110753132380002001c417070726f7665080108746f14011c4163746f724964000118616d6f756e74100110753132380003002c546f74616c537570706c790004002442616c616e63654f66040014011c4163746f724964000500001000000507001410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001801205b75383b2033325d0000180000032000000008001c081466745f696f1c46544576656e74000110205472616e736665720c011066726f6d14011c4163746f724964000108746f14011c4163746f724964000118616d6f756e74100110753132380000001c417070726f76650c011066726f6d14011c4163746f724964000108746f14011c4163746f724964000118616d6f756e74100110753132380001002c546f74616c537570706c790400100110753132380002001c42616c616e63650400100110753132380003000020081466745f696f3c496f46756e6769626c65546f6b656e00001801106e616d65040118537472696e6700011873796d626f6c040118537472696e67000130746f74616c5f737570706c791001107531323800012062616c616e6365732401505665633c284163746f7249642c2075313238293e000128616c6c6f77616e6365732c01905665633c284163746f7249642c205665633c284163746f7249642c2075313238293e293e000120646563696d616c730801087538000024000002280028000004081410002c00000230003000000408142400"

 const metadata = ProgramMetadata.from(meta);

 const addresLocal = account!.address

 const gasLimit = 375076928
 const percentage = 0.90
 const gasTotal = gasLimit * (1+percentage)
 const gasUsage = Math.round(gasTotal)

 
const message: any = {
  destination: programIDFT, // programId
  payload: {
    transfer: [
      decodeAddress('5FZ9rBwZyU6rNHhcmXFD96Jb95vwzjWtd3bL3kTisCXjL7Kv'),
      decodeAddress('5ELWh7zECXDpxdymSZKdyepeCk57fpPWVq98aWz2cUagcoYh'),
      5,
    ],
  },
  gasLimit: gasUsage,
  value: 0,
};

const messageTwo: any = {
  destination: programIDFT, // programId
  payload: {
    transfer: [
      decodeAddress('5ELWh7zECXDpxdymSZKdyepeCk57fpPWVq98aWz2cUagcoYh'),
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



const signer = async () => {
  const localaccount = account?.address;
  const isVisibleAccount = accounts.some(
    (visibleAccount) => visibleAccount.address === localaccount
  );

  if (isVisibleAccount) {
    // Create a message extrinsic
    const transferExtrinsic = await api.message.send(message, metadata);
    // const mnemonic = 'hub next valid globe toddler robust click demise silent pottery inside brass';
    const keyring = await GearKeyring.fromSuri('//Alice');

    await transferExtrinsic.signAndSend(keyring,(event:any)=>{
        console.log("transferencia de la main exitosa");
        
        
    })
  } else {
    alert.error("Account not available to sign");
  }
};
useEffect(() => {
  const ejecutarFirmantes = async () => {
    while (componenteMontado) {
      console.log("volvio a empezar el bucle");
      await signerTwo();
      await new Promise(resolve => setTimeout(resolve, 15000));
      await signer();
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  };

  // Inicia el bucle cuando el componente se monta
  ejecutarFirmantes();

  // Limpia el bucle cuando el componente se desmonta
  return () => {
    setComponenteMontado(false);
  };
}, [componenteMontado]);

//------------------------------VARA INTEGRATION-----------------------------------------------------------------------


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
  
      <ModalMintGaia 
      modalMint={modalMint} 
      setModalMint={setModalMint}
      excedenteCapturado={excedenteCapturado}
      setTotalGenerado={setTotalGenerado}
      setTotalConsumido={setTotalConsumido}/>
    </div>
  );
}
