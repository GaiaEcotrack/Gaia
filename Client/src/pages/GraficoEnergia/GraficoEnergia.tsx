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
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "@/store";
// React Router
import { Link, NavLink } from "react-router-dom";
// Funciones de formato de fecha
import { format } from "date-fns";
// Vara
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import {
  decodeAddress,
  ProgramMetadata,
  GearKeyring,
  GasInfo,
} from "@gear-js/api";
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
import Swal from "sweetalert2";
import { RootState } from "../../store/index";

// Nuevo grafico
import ReactECharts from "echarts-for-react";
import moment from "moment";
import CardEnergy from "@/components/CardsEnergy/CardEnergy";
import CardConsume from "@/components/CardsEnergy/CardConsume";
import CardGenerated from "@/components/CardsEnergy/CardGenerated";
import useVoucherUtils from "../home/VouchersUtils";
//api timezone
import { fetchTimeZoneInfo, TimeZoneApiResponse } from "./FetchTimeZone";
import { ApiLoader, Loader } from "@/components";

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
  const {
    createNewVoucher,
    voucherExpired,
    renewVoucherOneHour,
    voucherExists,
    accountVoucherId,
    addTwoTokensToVoucher,
  } = useVoucherUtils();
  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const energyRedux = useSelector((state: RootState) => state.app.pvGeneration);
  const {
    pvGenerationPower,
    pvBattery,
    devicesList,
    plantsList,
    pvGenerationPerMonth
  } = energyRedux || {};

  // estas dos funciones la movi arriba para usarlas en el scop
  const { accounts, account } = useAccount();
  const addresLocal = account?.address;
  const config = getConfig();

  //mensaje de conectar waller
  const [walletMessage, setWalletMessage] = useState("");

  const [userLog, setUserLog] = useState("");

  const [componenteMontado, setComponenteMontado] = useState(true);
  const [excedenteCapturado, setExcedenteCapturado] = useState<number | null>(
    null
  );
  const [alertWallet, setAlertWallet] = useState(false);
  const [modalMint, setModalMint] = useState<boolean>(false);
  const [totalGenerado, setTotalGenerado] = useState<number>(energyRedux?.pvGenerationPower);
  const [totalConsumido, setTotalConsumido] = useState<number>(0);
  const [totalExcedente, setTotalExcedente] = useState<number>(0);
  const [generacionActiva, setGeneracionActiva] = useState<boolean>(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [plantData, setPlantData] = useState<number[][]>([]);
  const [deviceData, setDeviceData] = useState([]);
  const [energy, setEnergy] = useState(null);
  const [energyBatery, setEnergyBatery] = useState();
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
  //!!!!!!!!!!!!!!!!
  // useEffect(() => {
  //   const fetchEnergy = async () => {
  //     try {
  //       const auth = getAuth();
  //       const user = auth.currentUser;
  //       console.log(auth);
        

  //       if (!user) {
  //         throw new Error("User is not authenticated");
  //       }

  //       const idToken = await user.getIdToken();

  //       const url = import.meta.env.VITE_APP_API_URL;
  //       const response = await fetch(
  //         `${url}/devices/battery?deviceId=18&setType=EnergyAndPowerPv&period=Month&Date=2024-02`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${idToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const data = await response.json();

  //       if (data.set) {
  //         const energy = data.set.map((energ: any) => energ.pvGeneration);
  //         setEnergyBatery(energy);
  //       } else {
  //         // Manejar el caso en que data.set es undefined
  //         console.error("data.set is undefined", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching energy data:", error);
  //     }
  //   };

  //   const fetchEnergyTwo = async () => {
  //     try {
  //       const auth = getAuth();
  //       const user = auth.currentUser;
  //       console.log(user);
        


  //       if (!user) {
  //         throw new Error("User is not authenticated");
  //       }

  //       const idToken = await user.getIdToken();
  //       const url = import.meta.env.VITE_APP_API_URL;
  //       const response = await axios.get(
  //         `${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Month?Date=2024-05`,
  //         //  (`${url}/devices/device-data?deviceId=16`),
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${idToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const data = response.data.set;
  //       const pvGeneration = data[0].pvGeneration;
  //       setTotalGenerado(pvGeneration);
  //       // Determina si la generación está activa basada en el umbral de 0.2
  //       setGeneracionActiva(pvGeneration > 0.2);

  //       // Actualiza totalConsumido y excedenteCapturado aquí 
  //       const totalConsumidoCalculado = pvGeneration * 0.5; 
  //       const excedenteCapturadoCalculado = Math.max(
  //         pvGeneration - totalConsumidoCalculado
  //       ); 

  //       setTotalConsumido(totalConsumidoCalculado);
  //       setExcedenteCapturado(excedenteCapturadoCalculado);

  //       // Actualizar localStorage con los nuevos valores
  //       localStorage.setItem("totalGenerado", JSON.stringify(pvGeneration));
  //       localStorage.setItem(
  //         "totalConsumido",
  //         JSON.stringify(totalConsumidoCalculado)
  //       );
  //       localStorage.setItem(
  //         "totalExcedente",
  //         JSON.stringify(excedenteCapturadoCalculado)
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
   
  //   fetchEnergyTwo();
  //   fetchEnergy();

  //   // Simula la actualización en tiempo real de los datos de energía
  //   const interval = setInterval(() => {
  //     setEnergyData(Math.random());
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  //!  chequear los valores del local storage

  //!  ------------------
  
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

    };

    const intervalId = setInterval(updateBarChart, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, [energyBatery]);

  const currentDate = new Date();

  const showDate = format(currentDate, "dd/MM/yyyy HH:mm");

  //! pausar el cotnador de energya cuando no se genera energia
  // Incrementa totalGenerado cada segundo, solo si generacionActiva es true
  useEffect(() => {
    if (generacionActiva) {
      const intervalId = setInterval(
        () => setTotalGenerado((prev) => prev + 0.01),
        1000
      );
      return () => clearInterval(intervalId);
    }
  }, [generacionActiva]);

  // Incrementa totalConsumido cada 7 segundos, sin detenerse, pero inicia solo si generacionActiva es true
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (generacionActiva) {
      intervalId = setInterval(() => {
        setTotalConsumido((prev) => prev + 0.005);
      }, 7000);
    } else if (!generacionActiva && intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [generacionActiva]);

  // Incrementa totalConsumido cada 7 segundos si totalGenerado es mayor a 0.2
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (totalGenerado > 0.2) {
      intervalId = setInterval(
        () => setTotalConsumido((prev) => prev + 0.005),
        7000
      );
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [totalGenerado]);
  //////////////////////
  const calcularExcedente = (totalGenerado: number, totalConsumido: number) =>
    Math.max(totalGenerado - totalConsumido);

  useEffect(() => {
    const handleCaptureExcedente = () => {
      if (totalConsumido < totalGenerado) {
        setTotalExcedente(calcularExcedente(totalGenerado, totalConsumido));
        setWalletMessage("");
      } else {
        setTotalExcedente(0);
      }
      const excedente = ()=>{
        return (totalGenerado * 0.2).toFixed(1)
      }
      
      setExcedenteCapturado((totalGenerado * 0.2).toFixed());
    };

    handleCaptureExcedente();

  }, [totalGenerado, totalConsumido, excedenteCapturado]);
  
  // Funcion para almacenar y actualizar los datos de energia del usuario
  const sendEnergyDataToBackend = async () => {
    
    const userId = localStorage.getItem("id");
 
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        throw new Error("User is not authenticated");
      }
      // const idToken = await user.getIdToken();
      const url = import.meta.env.VITE_APP_API_URL;
  
      const data = {
        energy_in_kilowatts: 0.0333301,  // Cambia estos valores a los correctos
        energy_tokenized_in_gaia_tokens: 0.03333005,  // Cambia estos valores a los correctos
        is_tokenized: true,  
        total_generated: parseFloat(localStorage.getItem("totalGenerado") || "0"),
        total_consumed: parseFloat(localStorage.getItem("totalConsumido") || "0"),
        total_excedent: parseFloat(localStorage.getItem("totalExcedente") || "0"),
        tokenization_date: new Date().toISOString()
      };
  
      const response = await axios.put(
        `${url}/energyGenerated/${userId}/energy`,  // Asegúrate de que la URL sea correcta
        data,
        {
          headers: {
            // Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json"
          }
        }
      );
  
      if (response.status === 201) {
        console.log("Energy data stored successfully");
      } else {
        console.error("Failed to store energy data", response.status);
      }
    } catch (error) {
      console.error("Error storing energy data", error);
    }
  };

  // Actualizar los datos de energia cada 23 hs
  // const scheduleEnergyDataSend = () => {
  //   const now = new Date();
  //   const currentTime = now.getTime();

  //   const nextTest = new Date(now.getTime() + 60 * 1000);  // 1 minuto en el futuro
  //   const timeUntilNextTest = nextTest.getTime() - currentTime;

  //   setTimeout(() => {
  //     sendEnergyDataToBackend();
  //     setInterval(sendEnergyDataToBackend, 60 * 60 * 1000); // Cada 1 hora
  //   }, timeUntilNextTest);
  // };

  // useEffect(() => {
  //   scheduleEnergyDataSend();
  // }, []);
  

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

  const gasToSpend = (gasInfo: GasInfo): bigint => {
    const gasHuman = gasInfo.toHuman();
    const minLimit = gasHuman.min_limit?.toString() ?? "0";
    const parsedGas = Number(minLimit.replaceAll(",", ""));
    const gasPlusTenPorcent = Math.round(parsedGas + parsedGas * 0.1);
    const gasLimit: bigint = BigInt(gasPlusTenPorcent);
    return gasLimit;
  };

  const claimVoucher = async (voucherId: string) => {
    if (!account || !api || !accounts) return;

    const localaccount = account?.address;
    const isVisibleAccount = accounts.some(
      (visibleAccount) => visibleAccount.address === localaccount
    );
    const key = import.meta.env.VITE_APP_ADMIN_KEY;

    if (isVisibleAccount) {
      const { signer } = await web3FromSource(account.meta.source);
      const gas = await api.program.calculateGas.handle(
        account?.decodedAddress ?? "0x00",
        programIDFT,
        { GetRewards: {
          "tx_id":null,
          "tokens": excedenteCapturado,
          "password": key,
          "transactions": {
              "to": account.decodedAddress,
              "amount": excedenteCapturado,
              "kw": totalGenerado.toFixed().toString().replace(".", ""),
              "surplus": totalConsumido.toFixed().toString().replace(".", "")
          }
      } },
        0,
        true,
        metadata
      );

      const transferExtrinsic = api.message.send(
        {
          destination: programIDFT, // programId
          payload: {
            getrewards:{
              "tx_id":null,
              "tokens": excedenteCapturado,
              "password": key,
              "transactions": {
                  "to": account.decodedAddress,
                  "amount": excedenteCapturado,
                  "kw": totalGenerado.toFixed().toString().replace(".", ""),
                  "surplus": totalConsumido.toFixed().toString().replace(".", "")
              }
          },
          },
          gasLimit: gasToSpend(gas),
          value: 0,
        },
        metadata
      );
      const voucherTx = api.voucher.call(voucherId, {
        SendMessage: transferExtrinsic,
      });

      try {
        await voucherTx.signAndSend(
          account?.decodedAddress,
          { signer },
          ({ status, events }) => {
            if (status.isInBlock) {
              setExcedenteCapturado(0);
              setTotalExcedente(0);
              setTotalGenerado(0);
              setTotalConsumido(0);

              alerta.success(`Transaction completed`);
            } else {
              console.log(`status: ${status.type}`);
              if (status.type === "Finalized") {
                alerta.success(status.type);
              }
            }
          }
        );
      } catch (error: any) {
        console.log(" transaction failed", error);
        const errorString = await error.toString();
        const feesError = await errorString.includes(
          "Inability to pay some fees , e.g. account balance too low"
        );

        if (feesError === true) {
          await addTwoTokensToVoucher(voucherId);
          console.log("actualizado");
        }

        alerta.info("Retry your transaction");
      }
    } else {
      alerta.error("Account not available to sign");
    }
  };

  const createVoucher = async () => {
    if (!api || !account) return;

    if (await voucherExists()) {
      console.log("Voucher already exists");

      const voucherId = await accountVoucherId();

      if (await voucherExpired(voucherId)) {
        console.log("Voucher expired");
        await renewVoucherOneHour(voucherId);
      }

      await claimVoucher(voucherId);

      return;
    }

    console.log("Voucher does not exists");

    try {
      const voucherId = await createNewVoucher();
      await claimVoucher(voucherId);
    } catch (error) {
      console.log("Error creating voucher");
    }
  };

  const signerVou = async () => {
    console.log("signer");
    if (!account || !accounts || !api) return;
    await createVoucher();
  };

  const onClose = () => {
    setAlertWallet(false);
  };

  const claimReward = () => {
    if (addresLocal === undefined) {
      setAlertWallet(true);
    } else {
      signerVou();
    }
  };
  
  
  // Creacion de usuario en la DB
  const URL = import.meta.env.VITE_APP_API_URL;
  const [email, setEmail] = useState("");
  const [foundUserId, setFoundUserId] = useState("");
  const [foundUserName, setFoundUserName] = useState("");

  const handleSearch = async () => {
    try {
      if (!localStorage.getItem("id")) {
        const response = await axios.get(`${URL}/users/search`, {
          params: {
            email: email,
          },
        });
        if (response.status === 200) {
          setFoundUserId(response.data._id);
          setFoundUserName(response.data.full_name);
        } else {
          setFoundUserId("");
          // console.error('Error al buscar usuario:', response.status);
        }
      }
    } catch (error) {
      // console.error('Error de red:', error);
    }
  };
  if (foundUserId) {
    localStorage.setItem("id", foundUserId);
  }
  const name = localStorage.getItem("name") || foundUserName;
  if (name) {
    localStorage.setItem("name", name);
  }

  const addNewUser = async () => {
    try {
      if (!localStorage.getItem("id")) {
        const response = await axios.post(`${URL}/users/`, {
          email: email,
        });
        if (response.status === 200) {
          console.log("Usuario creado con éxito");
          setFoundUserId(response.data.user_id);
          setFoundUserName(response.data.full_name);
          localStorage.setItem("id", foundUserId);
          localStorage.setItem("name", foundUserName);
          const timerId = setTimeout(() => {
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
          }, 10000);
          return () => clearTimeout(timerId);
        }
      }
    } catch (error) {
      // console.error('Error de red al crear usuario:', error);
    }
  };
  const [searchCompleted, setSearchCompleted] = useState(false);
  
  // useEffect(() => {
  //   const fetchUserData =  () => {
  //     const auth = getAuth();
  //     const user = auth.currentUser;
  //     const storedEmail = localStorage.getItem("email") ?? "";
  
  //     if (!storedEmail && user?.email) {
  //       localStorage.setItem("email", user.email);
  //     }
  //     setEmail(storedEmail || "");
  
  //     try {
  //        handleSearch();
  //       setSearchCompleted(true);
  
  //       if (searchCompleted) {
  //         addNewUser();
  //       }
  //     } catch (error) {
  //       console.error("Error during handleSearch:", error);
  //     }
  //   };
  //   fetchUserData()
  
  //   // Simulate real-time data updates
  //   const interval = setInterval(() => {
  //     setEnergyData(Math.random());
  //   }, 3000);
  
  //   return () => clearInterval(interval);
  // }, [email, handleSearch, searchCompleted]);


  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      const storedEmail = localStorage.getItem("email") ?? "";

      if (!storedEmail && user?.email) {
        localStorage.setItem("email", user.email);
      }
      setEmail(storedEmail || "");

      try {
        await handleSearch();
        setSearchCompleted(true);

        if (searchCompleted) {
          addNewUser();
        }
      } catch (error) {
        console.error("Error during handleSearch:", error);
      }
    };
    fetchData();
  }, [email, handleSearch]);

  // PopUp completar registro
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (localStorage.getItem("pendingDocs") === "pending") {
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
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
        textStyle: {
          color: "#ffffff",
        },
      },
      series: [
        {
          name: "Access Source",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 5,
            borderColor: "#1D1B41",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 3000, name: "Wind Energy" },
            { value: 7000, name: "Thermal Energy" },
            { value: 10000, name: "Solar Energy" },
          ],
        },
      ],
    };
  };

  // para el segundo grafico (barras)
  const [options, setOptions] = useState({});

  // Obtener datos de la API y actualizar barData
  // useEffect(() => {
  //   const fetchChartData = async () => {
  //     const url = `${
  //       import.meta.env.VITE_APP_API_URL
  //     }/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Month&Date=2024-03`;
  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       const data = await response.json();

  //       const colors = ["#e74c3c", "#3498db", "#2ecc71"];
  //       // Procesa y actualiza las opciones de ECharts
  //       setOptions({
  //         color: ["#74b9ff"],
  //         title: {
  //           textStyle: {
  //             color: "#FFFFFF",
  //           },
  //         },
  //         tooltip: {
  //           trigger: "axis",
  //           axisPointer: {
  //             type: "shadow",
  //           },
  //         },
  //         xAxis: {
  //           type: "category",
  //           data: data.set.map((item: any) => moment(item.time).format("MMM D")),
  //           axisLine: {
  //             lineStyle: {
  //               color: "#FFFFFF", // Cambia el color de la línea del eje X a blanco
  //             },
  //           },
  //           axisLabel: {
  //             color: "#FFFFFF", // Etiquetas del eje X en blanco
  //           },
  //           splitLine: {
  //             show: false, // Opcional: esconde las líneas de división para un diseño más limpio
  //           },
  //         },
  //         yAxis: {
  //           type: "value",
  //           axisLine: {
  //             lineStyle: {
  //               color: "#FFFFFF", // Cambia el color de la línea del eje Y a blanco
  //             },
  //           },
  //           axisLabel: {
  //             color: "#FFFFFF", // Etiquetas del eje Y en blanco
  //           },
  //           splitLine: {
  //             lineStyle: {
  //               color: "#FFFFFF", // Cambia el color de las líneas de división del eje Y si deseas mantenerlas
  //               opacity: 0.1, // Reduce la opacidad para hacerlas menos prominentes
  //             },
  //           },
  //         },
  //         series: [
  //           {
  //             data: data.set.map((item: any) => item.pvGeneration),
  //             type: "bar",
  //             barWidth: "60%",
  //             itemStyle: {
  //               color: "#74b9ff", // O define el color específico de la serie aquí
  //             },
  //           },
  //         ],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching chart data:", error);
  //     }
  //   };

  //   fetchChartData();
  // }, []);

  //! Medidor de intensidad de enrgia: esta tomando la data de la engeriga generada
  const [timeZoneData, setTimeZoneData] = useState<TimeZoneApiResponse | null>(
    null
  );

  useEffect(() => {
    fetchTimeZoneInfo("Europe/Berlin").then((data) => {
      if (data) {
        setTimeZoneData(data);
        // console.log(data);
      }
    });
  }, []);

  const getCurrentHour = (datetime: any) => {
    // console.log(datetime);

    if (!datetime) return 0;
    const berlinTime = new Date(datetime); // Hora actual en Berlín
    const hours = berlinTime.getHours(); // Obtenemos la hora local

    return hours; // Retornamos la hora actual en formato local
  };

  const [gaugeOptions, setGaugeOptions] = useState({});
  // useEffect(() => {
  //   const fetchEnergyData = async () => {
  //     const url = `${
  //       import.meta.env.VITE_APP_API_URL
  //     }/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Month?Date=2024-05`;
  //     try {
  //       const response = await fetch(url);
  //       if (!response.ok) throw new Error("Network response was not ok");
  //       const data = await response.json();
  //       console.log(data);

  //       // Accede a pvGeneration desde la respuesta de la API
  //       const gaugeValue = data.set[0].pvGeneration; // Asume que siempre hay al menos un elemento en 'set'

  //       // Configura las opciones del gráfico con el valor obtenido
  //       setGaugeOptions(getGaugeOption(gaugeValue));
  //     } catch (error) {
  //       console.error("Error fetching energy data:", error);
  //     }
  //   };

  //   fetchEnergyData();
  // }, []);

  const getGaugeOption = (gaugeValue: any) => {
    return {
      tooltip: {
        // formatter: "{a} <br/>{b}: {c}%",
      },
      series: [
        {
          name: "Energy Status",
          type: "gauge",
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              color: [
                [0.3, "#FF0000"],
                [0.7, "#FFFF00"],
                [1, "#00FF00"],
              ],
              width: 25,
            },
          },
          pointer: {
            show: true,
            width: 5,
            length: "70%",
          },
          detail: {
            show: true,
            formatter: function (value: any) {
              return `${value.toFixed(2)}  kw\n{white|PV Generation}`;
            },
            rich: {
              white: {
                color: "#fff",
                fontSize: 14,
                lineHeight: 20,
                padding: [5, 0], // Ajusta el espaciado si es necesario
              },
            },
            offsetCenter: [0, "60%"],
            color: "white",
            fontSize: 16,
          },
          data: [{ value: gaugeValue }],
        },
      ],
    };
  };

  // interfaz para los datos de las plantas
  interface PlantData {
    plantId: number;
    name: string;
  }




//********** FUNCION PETICIONES ***********/
const fetchEnergy = async ()=>{
const url = import.meta.env.VITE_APP_API_URL;
try {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authenticated");
  }
  const idToken = await user.getIdToken();
  const response = await axios.get(
    `${url}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Month?Date=2024-05`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = response.data.set;
  const pvGeneration = data[0].pvGeneration
  dispatch({ type: "SET_PV_GENERATION_POWER", payload: pvGeneration });
} catch (error) {
  console.log(error);  
};


}
const fetchDataChart = async ()=>{
  const url = `${import.meta.env.VITE_APP_API_URL}/devices/pv?deviceId=18&setType=EnergyAndPowerPv&period=Month&Date=2024-03`
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    dispatch({ type: "SET_PV_PER_MONTH", payload: data });

    
  } catch (error) {
    console.log(error);
    
  }
};

const fetchPlantData = async () => {
  try {
    const url = import.meta.env.VITE_APP_API_URL;
    const request = await axios.get(`${url}/plants/`);
    const response = request.data
    dispatch({ type: "SET_PLANT_LIST", payload: response });

  } catch (error) {
    
  }
}

const fetchAll = async () => {
  try {
    await fetchEnergy()
    await fetchDataChart()
    await fetchPlantData()
  } catch (error) {
    console.log(error);
    
  }
}


  const fetchAllData = async () => {
    const energy = energyRedux?.pvGenerationPower
    const plantList = energyRedux?.plantsList
    const energyPerMonth = energyRedux?.pvGenerationPerMonth
    const fetchEnergy = () => {
      setEnergyBatery(energy)
    };
  
    const fetchEnergyTwo =  () => {


        setTotalGenerado(energy);
        setGeneracionActiva(energy > 0.2);
  
        const totalConsumidoCalculado = energy * 0.5;
        const excedenteCapturadoCalculado = Math.max(energy - totalConsumidoCalculado);
  
        setTotalConsumido(totalConsumidoCalculado);
        setExcedenteCapturado(excedenteCapturadoCalculado);
  
        localStorage.setItem("totalGenerado", JSON.stringify(energy));
        localStorage.setItem("totalConsumido", JSON.stringify(totalConsumidoCalculado));
        localStorage.setItem("totalExcedente", JSON.stringify(excedenteCapturadoCalculado));

    };
  
    const fetchChartData = () => {

  
        setOptions({
          color: ["#74b9ff"],
          title: {
            textStyle: {
              color: "#FFFFFF",
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          xAxis: {
            type: "category",
            data: energyPerMonth.set.map((item: any) => moment(item.time).format("MMM D")),
            axisLine: {
              lineStyle: {
                color: "#FFFFFF",
              },
            },
            axisLabel: {
              color: "#FFFFFF",
            },
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#FFFFFF",
              },
            },
            axisLabel: {
              color: "#FFFFFF",
            },
            splitLine: {
              lineStyle: {
                color: "#FFFFFF",
                opacity: 0.1,
              },
            },
          },
          series: [
            {
              data: energyPerMonth.set.map((item: any) => item.pvGeneration),
              type: "bar",
              barWidth: "60%",
              itemStyle: {
                color: "#74b9ff",
              },
            },
          ],
        });
    };
  
    const fetchEnergyData = () => {
        setGaugeOptions(getGaugeOption(energy));
    };
  
  
    const fetchPlantData =  () => {
        if (plantList&& plantList.plants) {
          const transformedData = plantList.plants.map((plant: any , index: any) => {
            return [plant.plantId, Math.random() * 100, plant.name];
          });
          setPlantData(transformedData);
        } else {
          console.error("La respuesta no tiene el formato esperado:");
        }

    };
  
    const fetchDeviceData = async () => {
      const deviceId = "65fce26c471437c1bf25533c";
      const url = `${import.meta.env.VITE_APP_API_URL}/devices/${deviceId}`;
  
      try {
        const response = await axios.get(url);
  
        if (response.data && response.data.device) {
          const deviceData = response.data.device;
          const transformedData: any = [
            [deviceData.deviceId, Math.random() * 100, deviceData.name],
          ];
          setDeviceData(transformedData);
          console.log(transformedData);
        } else {
          console.error("La respuesta no tiene el formato esperado:", response);
        }
      } catch (error) {
        console.error("Error al cargar los datos del dispositivo:", error);
      }
    };
  
    // Call all fetch functions

      fetchEnergy();
      fetchEnergyTwo();
      fetchChartData();
      fetchEnergyData();
      fetchPlantData();
     await fetchDeviceData();

  };

  useEffect(() => {
    const energy = energyRedux?.pvGenerationPower
    const plantList = energyRedux?.plantsList
    const energyPerMonth = energyRedux?.pvGenerationPerMonth
    fetchAll()
    console.log(energyRedux);
    
  }, []);

  useEffect(() => {

    if (totalGenerado !== undefined) {
      localStorage.setItem("totalGenerado", totalGenerado.toString());
    }

  }, [totalGenerado]);
  
  useEffect(() => {
    localStorage.setItem("totalConsumido", totalConsumido.toString());
  }, [totalConsumido]);
  
  useEffect(() => {
    const calculatedExcedente = totalGenerado - totalConsumido;
    setTotalExcedente(calculatedExcedente);
    localStorage.setItem("totalExcedente", calculatedExcedente.toString());
  }, [totalGenerado, totalConsumido]);

  

  useEffect(() => {
    const storedTotalGenerado = localStorage.getItem("totalGenerado");
    const storedTotalConsumido = localStorage.getItem("totalConsumido");
    const storedTotalExcedente = localStorage.getItem("totalExcedente");
  
    if (storedTotalGenerado !== null) {
      setTotalGenerado(parseFloat(storedTotalGenerado));
    }
    if (storedTotalConsumido !== null) {
      setTotalConsumido(parseFloat(storedTotalConsumido));
    }
    if (storedTotalExcedente !== null) {
      setTotalExcedente(parseFloat(storedTotalExcedente));
    }
  }, []);
  




  //**********  FIN FUNCION PETICIONES ***********/




  // ! Grafico para mostrar las plantas.
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const url = import.meta.env.VITE_APP_API_URL; // Reemplaza con la URL correcta.
  //     try {
  //       const response = await axios.get(`${url}/plants/`);

  //       if (response.data && response.data.plants) {
  //         const transformedData = response.data.plants.map(
  //           (plant: any, index: any) => {
  //             // Asume que quieres usar el plantId como el eje X y un valor aleatorio para el eje Y
  //             return [plant.plantId, Math.random() * 100, plant.name]; // Incluye el nombre de la planta para mostrarlo en el tooltip
  //           }
  //         );
  //         setPlantData(transformedData);
  //       } else {
  //         console.error("La respuesta no tiene el formato esperado:", response);
  //       }
  //     } catch (error) {
  //       console.error("Error al cargar los datos de las plantas:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const getBarChartOption = (plantData: number[][]): any => {
    // Generando colores aleatorios para cada barra
    const colors = plantData.map(
      () => "#" + Math.floor(Math.random() * 16777215).toString(16)
    );

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line",
        },
        formatter: function (params: any) {
          const dataIndex = params[0].dataIndex;
          const plantNumber = plantData[dataIndex][0];
          const metric = params[0].value.toFixed(2);
          return `${params[0].name}<br/> Plant Number: ${plantNumber}<br/>Metric: ${metric}`;
        },
      },
      xAxis: {
        type: "category",
        data: plantData.map((item) => item[2]),
        axisLabel: {
          interval: 0,
          rotate: 45,
          color: "#fff",
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Metric",
          type: "line",
          data: plantData.map((item, index) => ({
            value: item[1],
            itemStyle: {
              color: colors[index % colors.length], // Utiliza el arreglo fijo de colores
            },
            symbolSize: 10,
            showSymbol: true,
          })),
          lineStyle: {
            color: "#5470C6",
          },
          smooth: true,
        },
      ],
    };
  };

  // ! Grafico para mostrar el device id conectado.
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const deviceId = "65fce26c471437c1bf25533c"; // ID del dispositivo
  //     const url = `${import.meta.env.VITE_APP_API_URL}/devices/${deviceId}`; // Actualiza la URL para incluir el ID del dispositivo

  //     try {
  //       const response = await axios.get(url);

  //       // Asumiendo que deseas usar el objeto "device" de la respuesta
  //       if (response.data && response.data.device) {
  //         const deviceData = response.data.device;
  //         // Transformar los datos para tu uso, por ejemplo:
  //         const transformedData = [
  //           [deviceData.deviceId, Math.random() * 100, deviceData.name],
  //         ];
  //         setDeviceData(transformedData); // Asumiendo que setDeviceData actualiza el estado con estos datos
  //         console.log(transformedData);
  //       } else {
  //         console.error("La respuesta no tiene el formato esperado:", response);
  //       }
  //     } catch (error) {
  //       console.error("Error al cargar los datos del dispositivo:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const getBarChartOption2 = (deviceData: any) => {
    // Generando colores aleatorios para cada barra
    // const colors = deviceData.map((item, index) => index % 2 === 0 ? '#708090' : '#0000FF');
    const colors = deviceData.map(() => "#58E2C2");

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow", // Más adecuado para gráficos de barras
        },
        formatter: function (params: any) {
          const dataIndex = params[0].dataIndex;
          const dataId = deviceData[dataIndex][0]; // Suponiendo que el primer elemento es un identificador único
          const value = params[0].value.toFixed(2); // Valor numérico, asegurándose de que esté formateado correctamente
          const timestamp = deviceData[dataIndex][2]; // Suponiendo que el tercer elemento es un timestamp o etiqueta de tiempo
          return `${timestamp}<br/> Data ID: ${dataId}<br/>Value: ${value}`;
        },
      },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        data: deviceData.map((item: any) => item[2]), // Usando el timestamp o etiqueta de tiempo como etiqueta de categoría
        axisLabel: {
          interval: 0,
          rotate: 45, // Puedes ajustar esto según sea necesario
          margin: 50,
          color: "#fff", // Aumenta el margen para mover las etiquetas más abajo si es necesario
        },
      },
      series: [
        {
          name: "Value",
          type: "bar", // Cambio de 'line' a 'bar' para crear un gráfico de barras
          data: deviceData.map((item: any, index: any) => ({
            value: item[1], // Asegurándose de que el valor esté mapeado correctamente
            itemStyle: {
              color: colors[index], // Asignando un color aleatorio a cada barra
            },
          })),
          barWidth: "30%", // Controla el ancho de las barras
        },
      ],
    };
  };

  //REDUX
  useEffect(() => {
    const url = import.meta.env.VITE_APP_API_URL;
    const auth = getAuth();
    const user = auth.currentUser?.email;
    const fetchDataUser = async () => {
      try {
        const request = await axios.get(`${url}/users/`);
        const response = request.data.users;
        const filter = response.filter(
          (userLog: any) => userLog.email === user
        );
        setUserLog(filter);
        dispatch({ type: "SET_LOGGED_IN_USER", payload: filter });
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataUser();
    fetchAllData()
  }, [energyRedux]);




  return (
    <div>
      {userRedux  && energyRedux?(
        <div className="mb-12">
        <div className=" text-white md:pl-24 md:pr-10 md:pb-0">
          <div className="flex flex-col lg:flex-row gap-5  p-2 justify-center graficos items-center">
          <CardGenerated supply={0} />
            <CardConsume supply={0} />
            <CardEnergy supply={0} />
          </div>
          <div className="flex justify-center text-center text-emerald-500  ">
            {walletMessage && <p className="text-xl">{walletMessage}</p>}
          </div>
          <div className="flex flex-col p-2  md:ml-10 justify-center items-center md:items-start">
            {popupOpen && <PopUpALert onClose={closePopup} />}
          </div>
          <div className="flex flex-col items-center sm:flex-row sm:justify-center">
            <div className="relative inline-block"></div>
          </div>
        </div>
        {/*  NUEVO DISENO DE LA PAGINA  */}
  
        <div className="flex flex-col m-16">
          {/* Header del Dashboard */}
          <div className="flex justify-around bg-blue-950 bg-opacity-90 text-white p-4 rounded-full">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Generation panel
            </button>
            <NavLink to="/panelUsuarioFinal">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Device manage
              </button>
            </NavLink>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={openPopup}
            >
              Alerts
            </button>
          </div>
  
          {/* Main content del Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-8">
            {/* Cost Predicted */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Energy type</h2>
              <ReactECharts
                option={getOption()}
                className="w-full"
                style={{ height: "300px" }}
              />
            </div>
  
            {/* Change in Cost */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Consume per day</h2>
              <ReactECharts
                option={options}
                className="w-full"
                style={{ height: "300px" }}
              />
            </div>
  
            {/* Usage Estimate */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Energy Intensity</h2>
              <div className="text-white mb-4">
                {timeZoneData ? (
                  <>
                    <p>
                      Time Zone device: {timeZoneData.timezone} (
                      {timeZoneData.abbreviation})
                    </p>
                    {/* <p>Current Time: {timeZoneData.datetime}</p> */}
                  </>
                ) : null}
              </div>
              {/* <ReactECharts
                option={gaugeOptions}
                style={{ height: "300px" }}
                className="w-full"
              /> */}
            </div>
  
            {/* Active Appliances */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Active plants</h2>
              <ReactECharts
                option={getBarChartOption(plantData)}
                className="w-full"
                style={{ height: "300px" }}
              />
            </div>
  
            {/* Energy Intensity */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Device usage Estimate</h2>
              <ReactECharts
                option={getBarChartOption2(deviceData)}
                className="w-full"
                style={{ height: "300px" }}
              />
            </div>
  
            {/* Carbon Footprint */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Carbon Footprint</h2>
              <ReactECharts
                option={options}
                className="w-full"
                style={{ height: "300px" }}
              />
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
      ): <ApiLoader/>}
    </div>
    
  );
};

export default GraficoEnergia;