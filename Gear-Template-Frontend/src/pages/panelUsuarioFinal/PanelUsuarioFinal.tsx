import Polygon from "../../assets/Polygon.svg";
import PolygonUp from "../../assets/PolygonUp.svg";
import back from "../../assets/back.svg";
import { useState, useEffect } from "react";

const PanelUsuarioFinal = () => {
  const [menuAbierto, setMenuAbierto] = useState<number | null>(null); // Cambié el tipo de estado a number | null
  const [dispositivosEncontrados, setDispositivosEncontrados] = useState<any[]>([]);

  const toggleMenu = (index: number | null) => {
    setMenuAbierto(index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('src/pages/panelUsuarioFinal/data-dispositivos-encontrados.json');
        const data = await response.json();
        setDispositivosEncontrados(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="">
      <div className="h-[39px] text-end">
        <p className="text-[#699CD0] text-[20px] mr-8 mt-8">Panel de usuario final</p>
      </div>
      <div className="flex flex-row flex-wrap justify-center space-x-16 mb-12 ml-72 mt-8">
        <h1 className="text-4xl text-[#5A5A5A] ">Dispositivos Encontrados</h1>
        <button className="w-28 h-10 bg-neutral-100 rounded-[5px] text-[#857D7D] ">
          Actualizar
        </button>
        <button>
          <img className="w-10 h-10" src={back} alt="" />
        </button>
      </div>

      {dispositivosEncontrados.map((dispositivo, index) => (
        <div 
        key={index} 
        className={`border-2 p-4 w-[762px] mx-auto my-auto mb-8 
        ${index === menuAbierto ? 'hidden' : ''
        }`}>
          <h2 className="text-[#5A5A5A] text-2xl mb-1">
            {dispositivo.Nombre}
          </h2>
          <p className="text-[#5A5A5A] text-[15px]">
            Tipo de Dispositivo: {dispositivo.Tipo_de_Dispositivo}
          </p>
          <p className="text-[#5A5A5A] text-[15px]">
            Fabricante: {dispositivo.Fabricante}
          </p>
          <div className="">
            <p className="text-end text-[#5A5A5A] font-light">
              {dispositivo.conectado ? 'Conectado' : 'Desconectado'}
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
        <div className="border-2 p-4 w-[762px] mx-auto my-auto mt-4">
          <h2 className="text-[#5A5A5A] text-2xl mb-6">
            {dispositivosEncontrados[menuAbierto].Nombre}
          </h2>
          <p className="text-[#5A5A5A] text-[15px]">
            Tipo de Dispositivo: {dispositivosEncontrados[menuAbierto].Tipo_de_Dispositivo}
          </p>
          <p className="text-[#5A5A5A] text-[15px]">
            Fabricante: {dispositivosEncontrados[menuAbierto].Fabricante}
          </p>
     
          <p className="text-[#5A5A5A] text-[15px]">Marca/Modelo: {dispositivosEncontrados[menuAbierto].Marca_Modelo}</p>
          <p className="text-[#5A5A5A] text-[15px]">Firmware Version: {dispositivosEncontrados[menuAbierto].Firmware_version}</p>
          <p className="text-[#5A5A5A] text-[15px]">Voltaje: {dispositivosEncontrados[menuAbierto].Voltaje}</p>
          <p className="text-[#5A5A5A] text-[15px]">Temperatura: {dispositivosEncontrados[menuAbierto].Temperatura}</p>
       
          <div className="mt-12">
            <button className="w-[99px] h-[40px] bg-neutral-100 rounded-[5px] text-[#857D7D] m-1">
              Reiniciar
            </button>
            <button className="w-[99px] h-[40px] bg-neutral-100 rounded-[5px] text-[#857D7D] m-1">
              Actualizar
            </button>
            <button className="w-[99px] h-[40px] bg-neutral-100 rounded-[5px] text-[#857D7D] m-1">
              Diagnosticar
            </button>
          </div>
          <div className="flex justify-between items-center mt-6">
            <a href="#" className="text-end text-[#5A5A5A] text-[15px] underline ">
              Opciones Avanzadas
            </a>
            <button
              className="flex items-centers ml-auto text-[#5A5A5A] text-[16px] text-base font-semibold"
              onClick={() => toggleMenu(null)}
            >
              Ver menos
              <img className="cursor-pointer ml-1 mt-2.5" src={PolygonUp} alt="" />
            </button>
            <span className="text-[#5A5A5A] font-light ml-auto">Desconectado</span>
            <br />
          </div>
        </div>
      )}
    </section>
  );
};

export default PanelUsuarioFinal;

