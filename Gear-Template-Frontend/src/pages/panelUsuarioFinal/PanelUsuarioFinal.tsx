/* eslint-disable */
import { useState, useEffect } from "react";

//imagenes
import Polygon from "../../assets/Polygon.svg";

import PolygonUp from "../../assets/PolygonUp.svg";

import { NavLink } from "react-router-dom";

import back from "../../assets/back.svg";
// React hooks

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

  return (
    <div className="bg-gray-100 m-4">
      <div className="text-end">
        <p className="text-[#699CD0] text-[20px] sm:text-[14px]  md:text-[28px] lg:text-[24px] xl:text-[24px] mr-8 mt-8 hidden md:block ">
          Panel de usuario final
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-12 sm:mt-8">
  <h1 className="sm:text-4xl text-[#5A5A5A] my-4 sm:my-0">
    Dispositivos Encontrados
  </h1>

  <button className="w-28 h-10 hidden border-2 bg-neutral-100 rounded-[5px] text-[#857D7D] mb-2 ml-8 mr-8 sm:inline">
    Actualizar
  </button>
  <NavLink to="/home">
    <button className="mb-2 sm:inline">
      <img className="w-10 h-10" src={back} alt="" />
    </button>
  </NavLink>
</div>

      {dispositivosEncontrados.map((dispositivo, index) => (
        <div
          key={index}
          className={`border-2 p-4 w-full sm:w-[762px] mx-auto my-auto mb-4 sm:mb-8 
            ${index === menuAbierto ? "hidden" : ""}`}
        >
          <h2 className="text-[#5A5A5A] sm:text-2xl mb-6  ">{dispositivo.Nombre}</h2>
          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Tipo de Dispositivo: {dispositivo.Tipo_de_Dispositivo}
          </p>
          <p className="text-[#5A5A5A] text-sm sm:text-lg ">
            Fabricante: {dispositivo.Fabricante}
          </p>
          <div className="">
            <p className="text-end text-[#5A5A5A] font-light">
              {dispositivo.conectado ? "Conectado" : "Desconectado"}
            </p>
            <br />
          </div>
          <div className="flex justify-center mt-[-32px]">
            <button
              className="flex items-center text-[#5A5A5A] text-[16px] text-base font-semibold"
              onClick={() => toggleMenu(index === menuAbierto ? null : index)}
            >
              Ver mas
              <img className="cursor-pointer ml-1" src={Polygon} alt="" />
            </button>
          </div>
        </div>
      ))}

      {menuAbierto !== null && (
        <div className="border-2 p-4 w-full sm:w-[762px] mx-auto my-auto mt-4 mb-8">
          <h2 className="text-[#5A5A5A] sm:text-2xl mb-6 ">
            {dispositivosEncontrados[menuAbierto].Nombre}
          </h2>
          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Tipo de Dispositivo:{" "}
            {dispositivosEncontrados[menuAbierto].Tipo_de_Dispositivo}
          </p>
          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Fabricante: {dispositivosEncontrados[menuAbierto].Fabricante}
          </p>

          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Marca/Modelo: {dispositivosEncontrados[menuAbierto].Marca_Modelo}
          </p>
          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Firmware Version:{" "}
            {dispositivosEncontrados[menuAbierto].Firmware_version}
          </p>
          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Voltaje: {dispositivosEncontrados[menuAbierto].Voltaje}
          </p>
          <p className="text-[#5A5A5A] text-sm sm:text-lg">
            Temperatura: {dispositivosEncontrados[menuAbierto].Temperatura}
          </p>

          <div className="mt-4 sm:mt-12">
            <button className="w-[99px] h-[40px] bg-neutral-200 rounded-[5px] text-[#857D7D] m-1">
              Reiniciar
            </button>
            <button className="w-[99px] h-[40px] bg-neutral-200 rounded-[5px] text-[#857D7D] m-1">
              Actualizar
            </button>
            <button className="w-[99px] h-[40px] bg-neutral-200 rounded-[5px] text-[#857D7D] m-1">
              Diagnosticar
            </button>
          </div>
          <div className="flex justify-between items-center mt-4 sm:mt-6">
            <a
              href="#"
              className="text-end text-[#5A5A5A] text-[15px] underline "
            >
              Opciones Avanzadas
            </a>
            <button
              className="flex ml-auto items-center text-[#5A5A5A] text-[16px] text-base font-semibold"
              onClick={() => toggleMenu(null)}
            >
              Ver menos
              <img
                className="cursor-pointer ml-1 mt-2.5"
                src={PolygonUp}
                alt=""
              />
            </button>
            <span className="text-[#5A5A5A] font-light ml-auto">
              Desconectado
            </span>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelUsuarioFinal;
