/* eslint-disable */
import { useState, useEffect } from "react";
import axios from 'axios'

//imagenes
import Polygon from "../../assets/Polygon.svg";

import PolygonUp from "../../assets/PolygonUp.svg";

import Update from "../../assets/Update.svg";

import { NavLink } from "react-router-dom";

import back from "../../assets/back.svg";
// React hooks

import { ApiLoader } from '../../components/loaders/api-loader/ApiLoader'

interface Dispositivo {
  deviceId:number;
  name: string;
  type: string;
  vendor: string;
  productId:number;
  isActive: boolean;
  product: string;
  serial: string;
  generatorPower: number;
  timezone: string;
}
const PanelUsuarioFinal = () => {
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null); // Cambié el tipo de estado a number | null
  const [devices, setDevices] = useState<
    Dispositivo[]
  >([]);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = (index: number | null) => {
    setMenuAbierto(index === menuAbierto ? null : index);
  };



  useEffect(() => {
    const fetchByAxios = async ()=>{
      try {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(`${apiUrl}/devices/plant-devices?plantId=13`)
        setDevices(response.data.devices)
        
      } catch (error) {
        console.log(error);
        
      }
    }
    fetchByAxios()
  }, []);

  useEffect(() => {
    if (menuAbierto !== null) {
      // Guardar la posición de desplazamiento actual antes de abrir los detalles
      setScrollPosition(window.scrollY);

      // Desplazarse al principio del componente para mostrar los detalles
      window.scrollTo(0, 0);
    } else {
      // Volver a la posición de desplazamiento guardada después de cerrar los detalles
      window.scrollTo(0, scrollPosition);
    }
  }, [menuAbierto, scrollPosition]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      setTimeout(async () => {
        const apiUrl = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(`${apiUrl}/devices/plant-devices?plantId=35`);

        setDevices(response.data.devices)
        setIsLoading(false);
        // alert('actualizado');
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };


  const imageUrl =
    "https://services.meteored.com/img/article/energy-overhaul-scientists-predict-by-the-2040s-solar-energy-will-dominate-our-power-grids-1697660406587_1280.jpeg";
  return (
    <section
      className="border-2 border-transparent  min-h-screen"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: "",
      }}
    >
      <div className=" m-16 sm:m-4 ">
        <div className="text-end">
          <p className="text-gray-100 text-[20px] sm:text-[14px]  md:text-[28px] lg:text-[24px] xl:text-[24px] mr-8 mt-8 hidden md:block ">
           User Panel
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-12 sm:mt-8">
          <h1 className="sm:text-4xl text-gray-800 my-4 sm:my-0">
            Your Devices
          </h1>

          <div>
            {isLoading ? (
              <div className="flex justify-center ml-6 mr-6 mb-8">
              {/* <p className="text-[#857D7D]">Cargando...</p> */}
              <ApiLoader /> 
              </div>
            ) : (
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="w-28 h-10 hidden border-2 bg-emerald-500 rounded-full text-gray-900 mb-2 ml-8 mr-8 sm:inline"
              >
                Refresh
              </button>
            )}
          </div>
          <NavLink to="/home">
            <button className="mb-2 sm:inline hidden">
              <img className="w-10 h-10" src={back} alt="" />
            </button>
          </NavLink>
          <button onClick={handleUpdate} disabled={isLoading}>
            {/* <p className="text-cyan-500 m-2">{isLoading ? "Cargando..." : ""}</p> */}

            <img className="w-10 h-10 sm:hidden" src={Update} alt="" />
          </button>
        </div>

        {devices.map((device, index) => (
          <div
            key={index}
            className={`border rounded-lg bg-current opacity-70 shadow-2xl p-4 w-full sm:w-[762px] mx-auto my-auto mb-4 sm:mb-8 
            ${index === menuAbierto ? "hidden" : ""}`}
          >
            <h2 className="text-gray-900 font-bold sm:text-2xl mb-6  ">
            {devices && device.name}
            </h2>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Device Type: {device.type}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg ">
              Made By: {device.vendor}
            </p>
            <div className="">
              <p className="text-end text-gray-900 font-bold text-[12px] sm:text-[16px]">
                {device.isActive ? "Connected" : "Disconnected"}
              </p>
              <br />
            </div>
            <div className="flex justify-center mt-[-32px]">
              <button
              
                className="flex items-center text-gray-900 font-bold text-[16px] text-base"
                onClick={(e) => {
                  e.preventDefault(); // Agrega esta línea para evitar el comportamiento predeterminado
                  toggleMenu(index === menuAbierto ? null : index);
                }}
              >
                <p className="text-[12px] sm:text-[16px]">View Detail</p>
                <img className="cursor-pointer ml-1" src={Polygon} alt="" />
              </button>
            </div>
          </div>
        ))}

        {menuAbierto !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="border-2 rounded-lg bg-white p-4 w-full sm:w-[762px] mx-auto mt-auto mb-8 fixed">
            <h2 className="text-gray-900 font-bold sm:text-2xl mb-6 ">
              {devices[menuAbierto].name}
            </h2>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Device Type:{" "}
              {devices[menuAbierto].type}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Made By: {devices[menuAbierto].vendor}
            </p>

            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Model: {devices[menuAbierto].product}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Serial:{" "}
              {devices[menuAbierto].serial || "None"}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Voltage: {devices[menuAbierto].generatorPower || "None" }
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Ubicate: {devices[menuAbierto].timezone}
            </p>

            <div className="mt-4 sm:mt-12">
              <button className="sm:w-[103px] w-[78px] h-[40px] bg-emerald-600 font-bold rounded-[5px] text-gray-900 text-[12px] sm:text-[16px] m-1">
                Refresh
              </button>
              <button className="sm:w-[103px] w-[78px] h-[40px] bg-yellow-600 font-bold rounded-[5px] text-gray-900 text-[12px] sm:text-[16px] m-1">
                Update
              </button>
              <button className="sm:w-[103px] w-[78px] h-[40px] bg-red-500 font-bold rounded-[5px] text-gray-900 text-[12px] sm:text-[16px] m-1">
                Analizate
              </button>
            </div>
            <div className="flex justify-between items-center mt-4 sm:mt-6">
              <a
                href="#"
                className="text-end text-gray-900 font-bold text-[15px] underline "
              >
                <p className="text-[10px] sm:text-[14px]">Advanced setting</p>
              </a>
              <button
                className="flex ml-auto items-center text-gray-900 font-bold text-[16px] text-base"
                onClick={(e) => {
                  e.preventDefault(); // Agrega esta línea para evitar el comportamiento predeterminado
                  toggleMenu(null);
                }}
              >
                <p className="text-[12px] sm:text-[16px]">Close</p>
                <img
                  className="cursor-pointer ml-1 mt-2.5"
                  src={PolygonUp}
                  alt=""
                />
              </button>
              <span className="text-gray-900 text-[12px] sm:text-[16px] font-light ml-auto">
              {devices[menuAbierto].isActive ? "Connected" : "Disconnected"}
              </span>
              <br />
            </div>
          </div>
          </div>  
        )}
      </div>
    </section>
  );
};

export default PanelUsuarioFinal;
