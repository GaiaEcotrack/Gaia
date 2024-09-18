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
import {
  getDailyConsumptionOption,
  getImprovedEnergyIntensityOption,
  getBarChartOption,
  getOption
} from './utils';
// Gráficos de React
// React Hooks
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// React Router
import { Link, NavLink } from "react-router-dom";
// Funciones de formato de fecha
// Componentes personalizados
// Auth

import { PopUpALert } from "../../components/PopUpALert/PopUpAlert";
// Imágenes
import { AlertModal } from "@/components/AlertModal/AlertModal";
import EnergyDeviceList from "@/components/EnergyComponentNew/EnergyDeviceList";
// import { SideBarNew } from "components/SideBarNew/SideBarNew";
import { getAuth } from "firebase/auth";
import axios from "axios";
import Swal from "sweetalert2";
// Nuevo grafico
import ReactECharts from "echarts-for-react";

import Container from "@/components/CardsEnergy/Container";
import { useAccount, useAlert } from "@gear-js/react-hooks";



ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);


/* eslint-disable */

interface Data {
  today_eq: number;
  reflux_station_data: {
    pv_power: number;
    meter_b_in_eq: number;
    self_eq: number;
  };
}

interface User {
  username: string;
  // otras propiedades
}

interface RootState {
  app: {
    loggedInUser: User[];
    
    // otras propiedades del estado
  };
  // otras propiedades del estado
}


const GraficoEnergia = () => {

  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);


  // estas dos funciones la movi arriba para usarlas en el scop


  const dispatch = useDispatch()
  //mensaje de conectar waller
  const [walletMessage, setWalletMessage] = useState("");

  const [userLog, setUserLog] = useState("");

  const [alertWallet, setAlertWallet] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [plantData, setPlantData] = useState<number[][]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);



  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };
  
  // Creacion de usuario en la DB
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
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

      } catch (error) {
        console.error("Error during handleSearch:", error);
      }
    };
    fetchData();
  }, [email, handleSearch]);

  useEffect(() => {
    if (searchCompleted) {
      addNewUser();
    }
  }, [searchCompleted]);

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





  //**********  FIN FUNCION PETICIONES ***********/



  //REDUX
  useEffect(() => {
    const url = import.meta.env.VITE_APP_API_EXPRESS;
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
  }, []);

  const onClose = ()=>{
    setAlertWallet(false)
  }


  const alert = useAlert()
  const [data, setData] = useState<Data | null>(null);
  const {account} = useAccount()
  useEffect(() => {
    const fetchData = async () => {
      if (userRedux !== null) {
        try {
          const apiUrl = import.meta.env.VITE_APP_API_EXPRESS;
          const request = await axios.post(`${apiUrl}/api/real-time-data`, {
            user_name: userRedux[0].username,
          });
          const response = request.data.data;
          setData(response);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [userRedux]);

  const calculateEnergyData = (data: Data | null) => {
    if (data) {
      const energyGenerated = (data.today_eq / 1000).toFixed(2);
      const energyGenerating = data.reflux_station_data.pv_power;
      const consumedCalculate = ((data.reflux_station_data.meter_b_in_eq / 1000) + (data.reflux_station_data.self_eq / 1000)).toFixed(2);
      const tokens = Math.floor(data.today_eq / 1000).toString();
      return { energyGenerated, energyGenerating, consumedCalculate, tokens };
    }
    return { energyGenerated: "0.00", energyGenerating: "0", consumedCalculate: "0.00", tokens: "0" };
  };

  const { energyGenerated, energyGenerating, consumedCalculate, tokens } = calculateEnergyData(data);


  const claimReward = async ()=>{
    try {
      const url = import.meta.env.VITE_APP_API_EXPRESS;
      await axios.post(`${url}/service/GaiaService/MintTokensToUser`,[account?.decodedAddress,tokens])
      alert.success('token sent')
    } catch (error) {
      alert.error('transaction error')
      console.log(error);
      
    }
  }




  return (
    <div>
      
        <div className="mb-12">
        <div className=" text-white md:pl-24 md:pr-10 md:pb-0">
          <div>
           <Container energyGenerated ={energyGenerated} energyGenerating={energyGenerating} consumedCalculate={consumedCalculate} tokens={tokens} claimReward={claimReward} />
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
            option={getDailyConsumptionOption()}
            className="w-full"
            style={{ height: '300px' }}
          />
            </div>
  
            {/* Usage Estimate */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl mb-2 text-white">Energy Intensity</h2>
              <ReactECharts
            option={getImprovedEnergyIntensityOption(energyGenerated)}
            className="w-full"
            style={{ height: '300px' }}
          />
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
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg flex flex-col items-start gap-10">
              <h2 className="text-xl mb-2 text-white">Device usage</h2>
              <EnergyDeviceList />
            </div>
  
            {/* Carbon Footprint */}
            <div className="bg-blue-950 bg-opacity-90 p-4 rounded-lg shadow-lg flex flex-col gap-10">
              <h2 className="text-xl mb-2 text-white">Carbon Footprint</h2>
              <h2 className="text center text-3xl mb-2 text-white">932 TONS</h2>
            </div>
          </div>
        </div>
  
        {/*   FIN NUEVO GRAFICO */}
        {alertWallet && (
          <div>
            <AlertModal onClose={onClose} />
          </div>
        )}
      </div>

    </div>
    
  );
};

export default GraficoEnergia;

