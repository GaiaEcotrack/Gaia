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
// React Hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "@/store";
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
import EnergyMonitor from "@/components/EnergyComponentNew/EnergyMonitor";
import EnergyDeviceStatus from "@/components/EnergyComponentNew/EnergyDeviceStatus";
import { AlertModal } from "@/components/AlertModal/AlertModal";
import EnergyDeviceList from "@/components/EnergyComponentNew/EnergyDeviceList";
// import { SideBarNew } from "components/SideBarNew/SideBarNew";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { getTokenFromFirebase, sendTokenToBackend } from "../../TokenFirebaseToBackend"
import Swal from "sweetalert2";
import { RootState } from '../../store/index';

// Nuevo grafico
import ReactECharts from 'echarts-for-react';
import moment from 'moment';



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
  const dispatch = useDispatch()

  const [token, setToken] = useState('');
  const userRedux = useSelector((state:RootState) => state.app.loggedInUser)


  // estas dos funciones la movi arriba para usarlas en el scop
  const { accounts, account } = useAccount();
  const addresLocal = account?.address;
  const config = getConfig();

  //mensaje de conectar waller
  const [walletMessage, setWalletMessage] = useState("");

  const [userLog, setUserLog] = useState("")

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
        const auth = getAuth();
        const user = auth.currentUser;
        console.log(user);
        

        if (!user) {
          throw new Error('User is not authenticated');
        }

        const idToken = await user.getIdToken();

        const url = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(
          `${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Month&Date=2024-02`,
          {
            headers: {
              "Authorization": `Bearer ${idToken}`,
              "Content-Type": "application/json"
            }
          }
        );
        const data = response.data.set;
        const energy = data.map(energ => energ.pvGeneration);
        setEnergyBatery(energy);
      } catch (error) {
        console.error('Error fetching energy data:', error);
      }
    };

    const fetchEnergyTwo = async () => {
      try {
        const url = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(
          `${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Recent`
        );
        const data = response.data.set;
        const pvGeneration = data[0].pvGeneration;
        console.log(pvGeneration);
        
        setTotalGenerado(pvGeneration);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEnergyTwo()
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

  // const [token, setToken] = useState('');

  // useEffect(() => {
  //   const auth = getAuth();
  //   const user = auth.currentUser;
  
  //   if (user) {
  //     user.getIdToken().then((idToken) => {
  //       console.log('Token de Firebase:', idToken); // Esta línea imprime el token en la consola
  //       // Aquí puedes enviar el token a tu backend si es necesario
  //       sendTokenToBackend('http://127.0.0.1:5000/your/endpoint', 'GET', idToken);
  //     }).catch((error) => {
  //       console.error('Error al obtener el token:', error);
  //     });
  //   }
  // }, []);

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
    const auth = getAuth();
    const user = auth.currentUser;
    // console.log(user?.email);
    const storedEmail = localStorage.getItem("email") ?? '';
    if(!storedEmail && user?.email){
      localStorage.setItem("email", user.email);
    }
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

  // ! NUEVO GRAFICO, las siguienes funciones le dan los estilos a cada card.

  const getOption = () => {
    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#ffffff'
        }
      },
      series: [
        {
          name: 'Access Source',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: '#1D1B41',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 3000, name: 'Wind Energy' },
            { value: 7000, name: 'Thermal Energy' },
            { value: 10000, name: 'Solar Energy' }
          ]
        }
      ]
    };
  };

  // ! grafico de barras NOTA: traer los datos reales

  const getBarOption = () => {
    // Extraer los datos y labels de barData
    const { labels, datasets } = barData; // Asumiendo que barData es tu estado con los datos
    const dataset = datasets[0];
  
    // Mapear los datos a los valores para el gráfico
    // Asumiendo que el orden de los datos en barData corresponde a los días de previousDay5 a currentDay
    const seriesData = dataset.data.map((value, index) => ({
      value, // El valor de cada barra
      // Aplicar el color de la barra basado en el color definido en barData, o un color por defecto si no se especifica
      itemStyle: { color: index % 2 === 0 ? '#58E2C2' : '#F7E53B' }
    }));
  
    return {
      color: ['#58E2C2'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: [
            moment().subtract(5, 'days').format('MMM D'),
            moment().subtract(4, 'days').format('MMM D'),
            moment().subtract(3, 'days').format('MMM D'),
            moment().subtract(2, 'days').format('MMM D'),
            moment().subtract(1, 'days').format('MMM D'),
            moment().format('MMM D')
          ],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: '#FDFDFD'
            }
          },
          axisLabel: {
            color: '#FDFDFD'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#FDFDFD'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#484E69'
            }
          },
          axisLabel: {
            color: '#FDFDFD'
          }
        }
      ],
      series: [
        {
          name: 'Cost',
          type: 'bar',
          barWidth: '40%',
          data: [
            { value: 203, itemStyle: { color: '#58E2C2' } }, // Primer color para la primera barra
            { value: 214, itemStyle: { color: '#F7E53B' } } , // Segundo color para la segunda barra
            
          ],
          data: seriesData // Usando la data mapeada desde barData
        }
      ]
    };
  };
  
  //! Medidor de intensidad de enrgia
  const getGaugeOption = () => {
    // Obtener el último dataset del gráfico de barras
  const lastDataset = barData.datasets[barData.datasets.length - 1];
  // Obtener el último valor de este dataset
  const lastValue = lastDataset.data[lastDataset.data.length - 1];

  const percentage = lastValue / 18000;
  
  useEffect(() => {
    const url = import.meta.env.VITE_APP_API_URL
    const auth = getAuth()
    const user = auth.currentUser?.email
    const fetchDataUser = async ()=>{
      try {
        const request = await axios.get(`${url}/users/`)
        const response = request.data.users
        const filter = response.filter((userLog:any) => userLog.email === user)
        setUserLog(filter)
        dispatch({ type: 'SET_LOGGED_IN_USER', payload: filter })
        
      } catch (error) {
        console.log(error);
      }
    }
    fetchDataUser()

    
  }, [])

  console.log(userRedux);
  


    return {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%",
        
      },
      series: [
        {
          name: 'Usage',
          type: 'gauge',
          detail: {
            color: '#FFFFFF',
            formatter: (value:number) => `${value.toFixed(0)}kWh`,
            offsetCenter: [0, '80%'], 
          fontSize: 14,
          },
          data: [{value: lastValue}],
          min: 0,
          max: 18000,
          splitNumber: 6,
          axisLine: {
            lineStyle: {
              color: [[percentage, '#58E2C2'], [1, '#48506E']],
              width: 30
            }
          },
          axisTick: { // Puntos de referencia (ticks)
            show: true,
            lineStyle: {
              color: '#FFFFFF', // Color de los ticks
              width: 1, // Grosor de los ticks
            },
            length: -5, // Longitud de los ticks
          },
          axisLabel: { // Etiquetas de los números alrededor del gauge
            color: '#FFFFFF', 
            distance: 25, 
            fontSize: 11
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          }
        }
      ]
    };
  };
  return (
    <div className="mb-12">
      <div className=" text-white md:pl-24 md:pr-10 md:pb-0">
        <div className="flex flex-col lg:flex-row  p-2 justify-center graficos items-center">
          <div className="flex flex-col bg-[#1d335b]  md:w-[380px] w-[380px] justify-center h-[170px] rounded overflow-hidden shadow-lg m-4">
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
        <div className="flex flex-col p-2  md:ml-10 justify-center items-center md:items-start">
          {/* <button
            type="button"
            className="cursor-not-allowed pointer-events-none  text-[14px] mt-4 md:mt-0 text-center md:text-left"
          >
            Generation Panel
          </button>
          <NavLink to="/panelUsuarioFinal">
            <button
              type="button"
              className=" text-[14px] underline mt-4 md:mt-0 text-center md:text-left"
            >
              Device Manage
            </button>
          </NavLink>
          <button
            type="button"
            className=" text-[14px] underline mt-4 md:mt-0 text-center md:text-left"
            onClick={openPopup}
          >
            Create Alerts
          </button> */}
          {popupOpen && <PopUpALert onClose={closePopup} />}
        </div>

        {/* <div className="justify-center mb-10">
          <Doughnut
            className="h-[300px] 2xl:h-[400px] justify-center "
            data={dataPie}
            options={optionsPie}
          />
        </div> */}

        <div className="flex flex-col items-center sm:flex-row sm:justify-center">
          <div className="relative inline-block">
            {/* <select
              className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] text-white m-1 pl-2"
              defaultValue="Energia Solar"
              onChange={(e) => console.log(e.target.value)} // Puedes manejar la selección aquí
            >
              <option value="Energia Solar">Solar Energy</option>
              <option value="Energia Termica">Thermal Energy</option>
              <option value="Energia Eolica">Wind Energy</option>
            </select> */}
            {/* <img src={PolygonDown} alt="" className="ml-2" /> */}
          </div>
          {/* <button
            type="button"
            className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] m-1"
          >
            Generated
            <img src={PolygonDown} alt="" className="ml-2" />
          </button> */}
          {/* <button
            type="button"
            className="flex items-center justify-center w-[150px] sm:w-[151px] h-[47px] bg-[#1d335b] rounded-[15px] m-1"
          >
            Real Time
            <img src={PolygonDown} alt="" className="ml-2" />
          </button> */}

          {/* <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col items-center sm:flex-row">
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
          </div> */}
        </div>

        {/* <div className="lg:absolute lef-[50%] lg:top-[15%] 2xl:top-[20%] lg:left-[76%] 2xl:left-[78%] laptop mt-12">
          <WeatherNavbar />
          <WeatherPanel />
        </div> */}

        {/* <div className="flex mx-auto max-w-screen-md h-[200px] mt-8">
          <Bar data={barData} options={optionsBar} />
          <div className="border-4 mt-10 xl:ml-32 bg-gray-100 h-32 rounded-full hidden lg:flex items-center justify-center border-gray-400">
            <p className="text-[#1d335b] text-xl m-2 text-center">{showDate}</p>
          </div>
        </div> */}
      </div>
      {/*  NUEVO DISENO DE LA PAGINA  */}

      <div className="flex flex-col ml-16">
      {/* Header del Dashboard */}
      <div className="flex justify-around bg-blue-950 bg-opacity-90 text-white p-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Generation panel
        </button>
        <NavLink to="/panelUsuarioFinal">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Device manage
        </button>
        </NavLink>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openPopup}>
          Alerts
        </button>
      </div>

      {/* Main content del Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
        {/* Cost Predicted */}
        <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2 text-white">Energy type</h2>
          <ReactECharts option={getOption()} className="w-full" style={{ height: '300px' }} />
        </div>

        {/* Change in Cost */}
        <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2 text-white">Consume per day</h2>
          <ReactECharts option={getBarOption()} className="w-full" style={{ height: '300px' }} />
        </div>

        {/* Usage Estimate */}
        <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2 text-white">Energy Intensity</h2>
          <ReactECharts option={getGaugeOption()} style={{ height: '300px' }} className="w-full" />
        </div>

        {/* Active Appliances */}
        <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2 text-white">Active Appliances</h2>
          {/* Inserta aquí tu lista o gráfico */}
        </div>

        {/* Energy Intensity */}
        <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2 text-white">Usage Estimate</h2>
          {/* Inserta aquí tu componente de gráfico Gauge */}
        </div>

        {/* Carbon Footprint */}
        <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl mb-2 text-white">Carbon Footprint</h2>
          {/* Inserta aquí tu componente de gráfico */}
        </div>
      </div>
    </div>

      {/*   FIN NUEVO GRAFICO */}
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