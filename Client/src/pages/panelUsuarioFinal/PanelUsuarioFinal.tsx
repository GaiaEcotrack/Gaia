/* eslint-disable */
import { useState, useEffect } from "react";

//imagenes
import Polygon from "../../assets/Polygon.svg";

import PolygonUp from "../../assets/PolygonUp.svg";

import Update from "../../assets/Update.svg";

import { NavLink } from "react-router-dom";

import back from "../../assets/back.svg";
// React hooks

import { ApiLoader } from '../../components/loaders/api-loader/ApiLoader'

interface Dispositivo {
  Nombre: string;
  Tipo_de_Dispositivo: string;
  Fabricante: string;
  conectado: boolean;
  Marca_Modelo: string;
  Firmware_version: string;
  Voltaje: string;
  Temperatura: string;
}
const PanelUsuarioFinal = () => {
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null); // Cambié el tipo de estado a number | null
  const [dispositivosEncontrados, setDispositivosEncontrados] = useState<
    Dispositivo[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = (index: number | null) => {
    setMenuAbierto(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          // "https://jsonplaceholder.typicode.com/users"
          "/data-dispositivos-encontrados.json"
        );
        const data = await response.json();
        setDispositivosEncontrados(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      setTimeout(async () => {
        const response = await fetch("/data-dispositivos-encontrados.json");
        const data = await response.json();

        // Obtener un índice aleatorio
        const randomIndex = Math.floor(Math.random() * data.length);

        const dispositivoAleatorio = data[randomIndex];

        // Actualizar el estado scon un dispositivo aleatorio
        setDispositivosEncontrados([dispositivoAleatorio]);
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
      className="border-2 border-transparent  "
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
            Panel de usuario final
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-12 sm:mt-8">
          <h1 className="sm:text-4xl text-gray-800 my-4 sm:my-0">
            Dispositivos Encontrados
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
                className="w-28 h-10 hidden border-2 bg-emerald-500 rounded-[5px] text-gray-900 mb-2 ml-8 mr-8 sm:inline"
              >
                Actualizar
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

        {dispositivosEncontrados.map((dispositivo, index) => (
          <div
            key={index}
            className={`border rounded-lg bg-current opacity-70 shadow-2xl p-4 w-full sm:w-[762px] mx-auto my-auto mb-4 sm:mb-8 
            ${index === menuAbierto ? "hidden" : ""}`}
          >
            <h2 className="text-gray-900 font-bold sm:text-2xl mb-6  ">
              {dispositivo.Nombre}
            </h2>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Tipo de Dispositivo: {dispositivo.Tipo_de_Dispositivo}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg ">
              Fabricante: {dispositivo.Fabricante}
            </p>
            <div className="">
              <p className="text-end text-gray-900 font-bold text-[12px] sm:text-[16px] font-light">
                {dispositivo.conectado ? "Conectado" : "Desconectado"}
              </p>
              <br />
            </div>
            <div className="flex justify-center mt-[-32px]">
              <button
                className="flex items-center text-gray-900 font-bold text-[16px] text-base font-semibold"
                onClick={() => toggleMenu(index === menuAbierto ? null : index)}
              >
                <p className="text-[12px] sm:text-[16px]">Ver mas</p>
                <img className="cursor-pointer ml-1" src={Polygon} alt="" />
              </button>
            </div>
          </div>
        ))}

        {menuAbierto !== null && (
          <div className="border-2 rounded-lg bg-current opacity-70 p-4 w-full sm:w-[762px] mx-auto my-auto mt-4 mb-8">
            <h2 className="text-gray-900 font-bold sm:text-2xl mb-6 ">
              {dispositivosEncontrados[menuAbierto].Nombre}
            </h2>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Tipo de Dispositivo:{" "}
              {dispositivosEncontrados[menuAbierto].Tipo_de_Dispositivo}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Fabricante: {dispositivosEncontrados[menuAbierto].Fabricante}
            </p>

            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Marca/Modelo: {dispositivosEncontrados[menuAbierto].Marca_Modelo}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Firmware Version:{" "}
              {dispositivosEncontrados[menuAbierto].Firmware_version}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Voltaje: {dispositivosEncontrados[menuAbierto].Voltaje}
            </p>
            <p className="text-gray-900 font-bold text-sm sm:text-lg">
              Temperatura: {dispositivosEncontrados[menuAbierto].Temperatura}
            </p>

            <div className="mt-4 sm:mt-12">
              <button className="sm:w-[103px] w-[78px] h-[40px] bg-emerald-600 font-bold rounded-[5px] text-gray-900 text-[12px] sm:text-[16px] m-1">
                Reiniciar
              </button>
              <button className="sm:w-[103px] w-[78px] h-[40px] bg-yellow-600 font-bold rounded-[5px] text-gray-900 text-[12px] sm:text-[16px] m-1">
                Actualizar
              </button>
              <button className="sm:w-[103px] w-[78px] h-[40px] bg-red-500 font-bold rounded-[5px] text-gray-900 text-[12px] sm:text-[16px] m-1">
                Diagnosticar
              </button>
            </div>
            <div className="flex justify-between items-center mt-4 sm:mt-6">
              <a
                href="#"
                className="text-end text-gray-900 font-bold text-[15px] underline "
              >
                <p className="text-[10px] sm:text-[14px]">Opciones Avanzadas</p>
              </a>
              <button
                className="flex ml-auto items-center text-gray-900 font-bold text-[16px] text-base font-semibold"
                onClick={() => toggleMenu(null)}
              >
                <p className="text-[12px] sm:text-[16px]">Ver menos</p>
                <img
                  className="cursor-pointer ml-1 mt-2.5"
                  src={PolygonUp}
                  alt=""
                />
              </button>
              <span className="text-gray-900 text-[12px] sm:text-[16px] font-light ml-auto">
                Desconectado
              </span>
              <br />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PanelUsuarioFinal;
