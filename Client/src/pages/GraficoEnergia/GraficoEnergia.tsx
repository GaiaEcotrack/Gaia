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
import { Link, NavLink } from "react-router-dom";
// Funciones de formato de fecha
import { format } from "date-fns";
// Vara
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { decodeAddress, ProgramMetadata, GearKeyring } from "@gear-js/api";
import { web3FromSource } from "@polkadot/extension-dapp";
// Componentes personalizados
import { ModalMintGaia } from "../../components/ModalMintGaia/ModalMintGaia";
// Auth

import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
// Imágenes
import PolygonDown from "../../assets/PolygonDown.svg";
import { WeatherNavbar } from "../../components/WeatherNavbar/WeatherNavbar";
import { WeatherPanel } from "../../components/WeatherNavbar/WeatherPanel";
import EnergyMonitor from "@/components/EnergyComponentNew/EnergyMonitor";
import EnergyDeviceStatus from "@/components/EnergyComponentNew/EnergyDeviceStatus";
import { AlertModal } from "@/components/AlertModal/AlertModal";
import EnergyDeviceList from "@/components/EnergyComponentNew/EnergyDeviceList";
// import { SideBarNew } from "components/SideBarNew/SideBarNew";
import { getAuth } from "firebase/auth";
import axios from "axios";
<<<<<<< HEAD
import { getTokenFromFirebase, sendTokenToBackend } from "../../TokenFirebaseToBackend"
=======
import Swal from "sweetalert2";
>>>>>>> d7f85c9af1fa2b07a71e446adc6eb2405d44bd1b

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
  color: "white",
};

const optionsBar = {
  responsive: true,
  color: "white",
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

interface SomeConfig {
  programIdKey: string;
  meta: string;
  MidWallet: string;
}

const getConfig = (): SomeConfig => {
  return {
    programIdKey: import.meta.env.VITE_APP_PROGRAM_ID,
    meta: import.meta.env.VITE_APP_MAIN_CONTRACT_METADATA,
    MidWallet: import.meta.env.VITE_APP_MID_KEY,
  };
};

const GraficoEnergia = () => {
  // estas dos funciones la movi arriba para usarlas en el scop
  const { accounts, account } = useAccount();
  const addresLocal = account?.address;
  const config = getConfig();

  //mensaje de conectar waller
  const [walletMessage, setWalletMessage] = useState("");

  const [componenteMontado, setComponenteMontado] = useState(true);
  const [excedenteCapturado, setExcedenteCapturado] = useState<number | null>(
    null
  );
  const [alertWallet, setAlertWallet] = useState(false);
  const [modalMint, setModalMint] = useState<boolean>(false);
  const [totalGenerado, setTotalGenerado] = useState<number>(0);
  const [totalConsumido, setTotalConsumido] = useState<number>(0);
  const [totalExcedente, setTotalExcedente] = useState<number>(0);
  const [popupOpen, setPopupOpen] = useState(false);
  const [energy, setEnergy] = useState(null);
  const [energyBatery , setEnergyBatery] = useState()
  const [barData, setBarData] = useState<ChartData<"bar", number[], string>>({
    labels: ["", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        type: "bar",
        label: "Energy values",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: ["#74C7ED", "#F37B7B", "#699CD0"],
        barThickness: 25,
      },
    ],
  });

  const [energyData, setEnergyData] = useState(50);

  useEffect(() => {
    const fetchEnergy = async () => {
      try {
        const url = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(
          `${url}/devices/battery?deviceId=18&setType=EnergyAndPowerPv&period=Month?Date=2024-02`
        );
        const data = response.data.set;
        const energy = data.map(energ => energ.pvGeneration);
        setEnergyBatery(energy);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEnergy();
  

    // Simula la actualización en tiempo real de los datos de energía
    const interval = setInterval(() => {
      setEnergyData(Math.random());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  useEffect(() => {
    // Recuperar valores desde localStorage
    const storedTotalGenerado = JSON.parse(
      localStorage.getItem("totalGenerado") || "0"
    );
    const storedTotalConsumido = JSON.parse(
      localStorage.getItem("totalConsumido") || "0"
    );
    const storedTotalExcedente = JSON.parse(
      localStorage.getItem("totalExcedente") || "0"
    );

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

      if (energyBatery) {
        const newBarData = {
          ...barData,
          datasets: [
            {
              ...barData.datasets[0],
              data: energyBatery,
            },
          ],
        };
        setBarData(newBarData);
      }

      localStorage.setItem("totalGenerado", JSON.stringify(totalGenerado));
      localStorage.setItem("totalConsumido", JSON.stringify(totalConsumido));
      localStorage.setItem("totalExcedente", JSON.stringify(totalExcedente));
    };

    const intervalId = setInterval(updateBarChart, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, [energyBatery]);
  

  
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
    // ... (your existing code)
    const handleCaptureExcedente = () => {
      if (totalConsumido < totalGenerado) {
        setTotalExcedente(calcularExcedente(totalGenerado, totalConsumido));
        setWalletMessage("");
      } else {
        setTotalExcedente(0);
      }
      const excedente = Math.floor(
        calcularExcedente(totalGenerado, totalConsumido) * 10
      );
      setExcedenteCapturado(excedente);
    };

    handleCaptureExcedente();

    // ... (your existing code)
  }, [totalGenerado, totalConsumido, excedenteCapturado]);

  // const handleCaptureExcedente = () => {
  //   const excedente = Math.floor(
  //     calcularExcedente(totalGenerado, totalConsumido) * 10
  //   );
  //   setExcedenteCapturado(excedente);
  // };


  //* token firabse to backend

  const [token, setToken] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      user.getIdToken().then((idToken) => {
        setToken(idToken);
        console.log('Token de Firebase:', idToken); // Esta línea imprime el token en la consola
        // Aquí puedes enviar el token a tu backend si es necesario
        sendTokenToBackend(idToken);
      }).catch((error) => {
        console.error('Error al obtener el token:', error);
      });
    }
  }, []);

  // const [token, setToken] = useState('');
  // useEffect(() => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;

  //   if (user) {
  //     user.getIdToken().then((idToken) => {
  //       setToken(idToken);
  //       console.log('Token de Firebase:', idToken);

  //       // Aquí puedes enviar el token a tu backend si es necesario
  //       sendTokenToBackend(idToken);
  //     }).catch((error) => {
  //       console.error('Error al obtener el token:', error);
  //     });
  //   }
  // }, []);

  // //////////////

  // const sendTokenToBackend = async (token: string) => {
  //   try {
  //     // Asegúrate de reemplazar esta URL con la URL de tu servidor Flask
  //     const url = "http://127.0.0.1:5000/users";
  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Opcionalmente, puedes enviar el token en un header Authorization
  //         "Authorization": `Bearer ${token}`,
  //       },
  //       // O enviar el token en el cuerpo de la solicitud, según prefieras
  //       body: JSON.stringify({ token }),
  //     });
  
  //     const data = await response.json();
  //     console.log("Respuesta del backend:", data);
  //   } catch (error) {
  //     console.error("Error al enviar token al backend:", error);
  //   }
  // };
  //-------------------------------------------------------------------VARA INTEGRATION

  const alerta = useAlert();
  // const { accounts, account } = useAccount();
  const { api } = useApi();
  // Add your programID
  const programIdKey = config.programIdKey; // se modico esa linea donde anteriormente estaba import.meta.env.VITE_APP_PROGRAM_ID para correr los test si se desea modificar esta en la linea 95

  // Add your metadata.txt
  const meta = config.meta; // se modico esa linea donde anteriormente estaba import.meta.env.VITE_APP_META_DATA para correr los test si se desea modificar esta en la linea 96
  const MidWallet = config.MidWallet; // se modico esa linea donde anteriormente estaba import.meta.env.VITE_APP_MID_KEY para correr los test si se desea modificar esta en la linea 97

  const addresTransaction = account?.address;

  if (
    addresTransaction !== undefined &&
    meta !== undefined &&
    MidWallet !== undefined
  ) {
    const programIDFT = programIdKey;

    const metadata = ProgramMetadata.from(meta);

    const messageTwo: any = {
      destination: programIDFT, // programId
      payload: {
        transfer: [
          decodeAddress(MidWallet),
          decodeAddress(addresTransaction),
          3,
        ],
      },
      gasLimit: 9899819245,
      value: 0,
    };

    // useEffect(() => {
    //   const ejecutarFirmantes = async () => {
    //     // Verificar si account.address no es undefined
    //     if (account?.address !== undefined) {
    //       await signerTwo();
    //       await new Promise(resolve => setTimeout(resolve, 15000));
    //     }
    //   };

    //   // Inicia el bucle cuando el componente se monta y account.address no es undefined
    //   if (componenteMontado && account?.address !== undefined) {
    //     ejecutarFirmantes();
    //   }

    //   // Limpia el bucle cuando el componente se desmonta
    //   return () => {
    //     setComponenteMontado(false);
    //   };
    // }, [componenteMontado, account?.address]);
  }
  const programIDFT = import.meta.env.VITE_APP_MAIN_CONTRACT_ID;

  const metadata = ProgramMetadata.from(meta);

  const signerTwo = async () => {
    const localaccount = account?.address;

    const isVisibleAccount = accounts?.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );

    if (isVisibleAccount && api) {
      const messageThree: any = {
        destination: programIDFT, // programId
        payload: {
          transferred: [
            decodeAddress(MidWallet),
            decodeAddress(localaccount!),
            excedenteCapturado,
          ],
        },
        gasLimit: 9999819245,
        value: 0,
      };
      // Create a message extrinsic
      const transferExtrinsic = await api.message.send(messageThree, metadata);

      const injector = await web3FromSource(
        accounts?.[0]?.meta.source || "unknown"
      );

      transferExtrinsic
        .signAndSend(
          account?.address ?? alerta.error("No account"),
          { signer: injector.signer },
          ({ status }: { status: any }) => {
            if (status.isInBlock) {
              setExcedenteCapturado(0);
              setTotalExcedente(0);
              setTotalGenerado(0);
              setTotalConsumido(0);
              alerta.success(status.asInBlock.toString());
            } else {
              alerta.info("In process");
              if (status.type === "Finalized") {
                alerta.success(status.type);
              }
            }
          }
        )
        .catch((error: any) => {
          alerta.error(error.toString());
        });
    } else {
      alerta.error("Account not available to sign");
    }
  };

  const onClose = () => {
    setAlertWallet(false);
  };

  const claimReward = () => {
    if (addresLocal === undefined) {
      setAlertWallet(true);
    } else {
      signerTwo();
    }
  };


// Validacion de email en DB (alerta de registro)
  const URL = import.meta.env.VITE_APP_API_URL
  const [email, setEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || '');    
    handleSearch();
  }, [email]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: {
          email: email,
        },
      });  
      if (response.status === 200) {
        setFoundUserId(response.data._id);
      } else if (response.status === 404) {
        setFoundUserId('');
        console.log('Usuario no encontrado');
      } else {
        console.error('Error al buscar usuario:', response.status);
      }
    } catch (error) {
      // console.error('Error de red:');
    }  
  };

  localStorage.setItem("id", foundUserId);  

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (!(localStorage.getItem("id"))) {
        Swal.fire({
          title: "Don't forget to complete your registration",         
          icon: "warning",
          iconColor: "#3085d6",
          showCancelButton: true,
          confirmButtonText: "Go register !",
          confirmButtonColor: "#1f69b4de",
          cancelButtonText: "Later",
          cancelButtonColor: "#b82828cd",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/userReg";             
          }
        });
      }
    }, 10000);
    return () => clearTimeout(timerId);
  }, []);
  

  //------------------------------VARA INTEGRATION-----------------------------------------------------------------------

  return (
    <div className="mb-12">
      <div className=" text-white md:pl-24 2xl:pl-32 md:pr-10 md:pb-0">
        <div className="flex flex-col lg:flex-row  p-2 justify-center graficos items-center">
          <div className="flex flex-col bg-[#1d335b]  md:w-[380px] w-[380px] justify-center h-[170px]   rounded overflow-hidden shadow-lg m-4 mt-6">
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
              <span className=" mb-4 mr-4">Total consumed</span>
            </div>
          </div>
          <div className="flex flex-col bg-[#1d335b] md:w-[380px] w-[380px] justify-center h-[170px] rounded overflow-hidden shadow-lg  m-4">
            <div className="flex flex-col justify-center items-center h-full">
              <span className="font-[600] text-[40px] text-center mt-8">
                {totalExcedente.toFixed(3)} Kw
              </span>
            </div>
            <div className="flex justify-end items-end h-20">
              <img
                src="./LOGOGAIASOLO.png"
                className="w-16 h-16 mr-8 mb-2"
                alt=""
              />
              <span className=" mb-4 mr-4 font-bold text-white">
                Total surplus tokens:
              </span>
              <h2 className="mb-4 mr-4 font-bold text-emerald-400">
                {excedenteCapturado}
              </h2>
              <button
                className="bg-purple-500 p-2.5 text-white mb-2 mr-2 rounded-full transition duration-200 ease-in-out hover:bg-purple-700 active:bg-purple-900 focus:outline-none"
                onClick={() => {
                  claimReward();
                }}
              >
                Reward
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center text-center text-emerald-500  ">
          {walletMessage && <p className="text-xl">{walletMessage}</p>}
        </div>
        <div className="flex flex-col p-2 mb-6 md:ml-10 justify-center items-center md:items-start">
          <button
            type="button"
            className="cursor-not-allowed pointer-events-none  text-[18px] mt-4 md:mt-0 text-center md:text-left"
          >
            Generation Panel
          </button>
          <NavLink to="/panelUsuarioFinal">
            <button
              type="button"
              className=" text-[18px] underline mt-4 md:mt-0 text-center md:text-left"
            >
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
          <button
            type="button"
            className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] m-1"
          >
            Generated
            <img src={PolygonDown} alt="" className="ml-2" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] m-1"
          >
            Real Time
            <img src={PolygonDown} alt="" className="ml-2" />
          </button>

          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-center sm:flex-row">
            <div className="flex flex-col items-center mb-2 sm:mb-0">
              <span className=" text-[16px] font-[700]">0 Kws</span>
              <h3 className=" ml-2 p-2">Current</h3>
            </div>
            <div className="flex flex-col items-center mb-2 sm:mb-0 sm:ml-4">
              <span className="t text-[16px] font-[700]">0 Kws</span>
              <h3 className="t ml-2 p-2">Basic</h3>
            </div>
            <div className="flex flex-col items-center mb-2 sm:mb-0">
              <span className=" text-[16px] font-[700]">0 Kws</span>
              <h3 className=" ml-2 p-2">Total</h3>
            </div>
          </div>
        </div>

        <div className="lg:absolute lef-[50%] lg:top-[15%] 2xl:top-[20%] lg:left-[76%] 2xl:left-[78%] laptop mt-12">
          <WeatherNavbar />
          <WeatherPanel />
        </div>

        <div className="flex mx-auto max-w-screen-md h-[200px] mt-8">
          <Bar data={barData} options={optionsBar} />
          <div className="border-4 mt-10 xl:ml-32 bg-gray-100 h-32 rounded-full hidden lg:flex items-center justify-center border-gray-400">
            <p className="text-[#1d335b] text-xl m-2 text-center">{showDate}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center flex-col gap-10 justify-center">
        <h1 className="text-6xl font-bold text-white">
          Status of your devices
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-10 justify-center">
          <EnergyMonitor percentage={60} size={200} />
          <EnergyDeviceStatus />
          <EnergyDeviceList />
        </div>
      </div>

      <ModalMintGaia
        modalMint={modalMint}
        setModalMint={setModalMint}
        excedenteCapturado={excedenteCapturado}
        setTotalGenerado={setTotalGenerado}
        setTotalConsumido={setTotalConsumido}
      />

      {alertWallet && (
        <div>
          <AlertModal onClose={onClose} />
        </div>
      )}
    </div>
  );
};

export default GraficoEnergia;