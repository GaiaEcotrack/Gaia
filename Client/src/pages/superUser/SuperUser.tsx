// Importaciones de React
import { useState } from "react";
// Importaciones de react-icons
import { BsCheck2Circle } from "react-icons/bs";
import { HiOutlineBell } from "react-icons/hi";
import { FiAlertCircle } from "react-icons/fi";
// Importaciones de chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// Importaciones de react-chartjs-2
import { Doughnut } from "react-chartjs-2";

// Importaciones de estilos
import '../../App.css';
// Importaciones de componentes propios
import { ModalAdministrar } from "../../components/ModalAdministrar/ModalAdministrar";
import { ModalConfig } from "../../components/ModalConfig/ModalConfig";
import { ModalManten } from "../../components/ModalMantenimiento/ModalManten";
import { ModalGenerad } from "../../components/ModalGeneradores/ModalGenerad";
import { ModalTransac } from "../../components/ModalTransacciones/ModalTransac";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Energia Eólica", "Energia Térmica", "Energia Solar"],
  datasets: [
    {
      data: [10000, 7000, 3000], // VALORES HARDCODEADOS
      backgroundColor: ["#699CD0", "#74C7ED", "#F0B778"],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  color: 'white',

  // ... otras opciones
};

export function SuperUser () {

  const [showAdmin, setShowAdmin] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [showManten, setShowManten] = useState(false)
  const [showGenerad, setShowGenerad] = useState(false)
  const [showTransac, setShowTransac] = useState(false)

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center pl-20">      

        <div className="bg-[#1d335b] md:hidden w-[245px] h-[120px] 2xl:h-[300px] rounded overflow-hidden shadow-md flex flex-col justify-center mt-5 mb-2">
          <div className="flex justify-center items-center h-20">
            <span className="text-center text-7xl  text-[#4bc844]">
              <BsCheck2Circle />
            </span>
          </div>

          <div className="flex justify-center items-center h-10">
            <span className="text-center">
              El estado de la red es seguro
            </span>
          </div>
        </div>

        <section className="hidden md:w-[30%] md:flex flex-col justify-center items-center md:h-[35vh] 2xl:h-[30vh] laptop">
            <div className="bg-[#1d335b] w-[300px] h-[100px] rounded overflow-hidden shadow-lg flex flex-col m-4">
              <div className="flex justify-end mr-2">
                <span className=" text-2xl">
                  <FiAlertCircle />
                </span>
              </div>
              <div className="bg-[#1d335b] flex justify-center items-center h-full">
              <span className="">
                  La red Gaia esta inestable
                </span>
              </div>
              <div className="bg-[#1d335b]flex justify-end mr-2">
                <span className="flex justify-end mr-2">
                  Alerta
                </span>
              </div>
            </div>
        
            <div className="bg-[#1d335b] w-[300px] h-[100px] rounded overflow-hidden shadow-lg flex flex-col m-4">
              <div className="flex justify-end mr-2">
                <span className=" text-2xl">
                  <HiOutlineBell />
                </span>
              </div>
              <div className="flex justify-center items-center h-full">
              <span className="">
                  Hay actualizaciones de software
                </span>
              </div>
              <div className="flex justify-end mr-2">
                <span className="">
                  Notificacion
                </span>
              </div>
            </div>
        </section>        

        <div className="w-full md:w-[40%]">
          <section className="flex justify-center items-center h-[25vh] md:h-[30vh] md:mb-6 mb-0">
            <div style={{ transform: "scale(0.70)" }}>
              <div className="flex flex-wrap lg:flex-nowrap m-2 p-2 justify-center items-center ">
                <div className="bg-[#1d335b] w-[349px] h-[150px] lg:h-[203px] rounded overflow-hidden shadow-lg flex flex-col lg:mr-6 2xl:mr-4">
                  <div className="flex justify-center items-center h-20 md:h-full">
                    <span className="font-[600] text-[40px] 2xl:text-[50px] text-center mt-10 md:mt-auto">
                      100.000 Kw
                    </span>
                  </div>

                  <div className="flex justify-end items-end h-16 md:h-full">
                    <span className=" text-[16px] 2xl:text-[22px] mb-4 mr-4">
                      Total Generado en la red
                    </span>
                  </div>
                </div>

                <div className="bg-[#1d335b] w-[349px] h-[150px] lg:h-[203px] rounded overflow-hidden shadow-lg flex flex-col lg:ml-6 2xl:ml-4">
                  <div className="flex justify-center items-center h-20 md:h-full">
                    <span className="font-[600] text-[40px] 2xl:text-[50px] text-center mt-10 md:mt-auto">
                      70.000 Kw
                    </span>
                  </div>

                  <div className="flex justify-end items-end h-16 md:h-full">
                    <span className="text-[#A7A4B2E0] text-[16px] 2xl:text-[22px] mb-4 mr-4">
                      Total Consumido en la red
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>       

          <section>
            <div className="flex">
              <Doughnut
                className="h-[300px] 2xl:h-[400px] mt-4 md:mt-0"
                data={data}
                options={options}
                />
            </div>

            <div className="mt-6 flex justify-center laptop">            
              <button type="button" className="bg-[#1d335b] w-[113px] 2xl:w-[151px] h-[35px] 2xl:h-[47px] rounded-[15px]  m-1">
                Energia Solar
              </button>

              <button type="button" className="bg-[#1d335b] w-[113px] 2xl:w-[151px] h-[35px] 2xl:h-[47px] rounded-[15px]  m-1 ml-8">
                Tiempo real 
              </button>

              <div className="ml-8 w-28">
                <span className=" text-[16px] font-[700]">
                  0 Kws
                </span>
                <p className="">Uso de la red</p>
              </div>      
            </div>
          </section>
        </div>

        <section className="md:w-[30%] flex justify-center items-center md:h-[86vh] 2xl:h-[650px] mt-8 md:mt-10">
          <div className="hidden md:flex flex-col h-[115vh] 2xl:h-[700px] laptop">
            <div className="bg-[#1d335b] w-[300px] h-[600px] 2xl:h-[300px] rounded overflow-hidden shadow-lg md:flex flex-col justify-center m-4">
              <div className="flex justify-center items-center h-32">
                <span className="text-center text-8xl  text-[#4bc844]">
                  <BsCheck2Circle />
                </span>
              </div>

              <div className="flex justify-center items-center h-10">
                <span className="text-center ">
                  El estado de la red es seguro
                </span>
              </div>

              <div className="flex justify-center items-center h-10">
                <span className="">
                  1000 kWh de capacidad actual
                </span>
              </div>
            </div>
        
            <div className="w-[300px] h-full 2xl:h-[450px] rounded flex flex-col m-4 2xl:mt-0">
              <div className="flex flex-col items-end mt-10">           
                <button type="button" onClick={() => {setShowConfig(true)}} className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff]" >
                  Configuracion del sistema
                </button>
                
                <button type="button" onClick={() => {setShowManten(true)}} className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff] mt-4" >
                  Mantenimiento del sistema
                </button>

                <button type="button" onClick={() => {setShowGenerad(true)}} className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff] mt-4" >
                  Administrar generadores
                </button>

                <button type="button" onClick={() => {setShowTransac(true)}} className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff] mt-4" >
                  Administrar transacciones
                </button>

                <button type="button" className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff] mt-4" >
                  Configuracion de las tarifas
                </button>

                <button type="button" className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff] mt-4" >
                  Control de la red
                </button>

                <button type="button" className="w-[250px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff] mt-4" >
                  Informes y Analisis
                </button>           
              </div>
            </div>
          </div>
          
          <button type="button" onClick={() => {setShowAdmin(true)}} className="md:hidden w-[150px] h-[40px] bg-[#1d335b] rounded-[5px] text-lg text-[#ffffff]" >
            Administrar
          </button>
        </section>
        
      </div>

      <ModalAdministrar showAdmin={showAdmin} setShowAdmin={setShowAdmin}/>
      <ModalConfig showConfig={showConfig} setShowConfig={setShowConfig}/>
      <ModalManten showManten={showManten} setShowManten={setShowManten}/>
      <ModalGenerad showGenerad={showGenerad} setShowGenerad={setShowGenerad}/>
      <ModalTransac showTransac={showTransac} setShowTransac={setShowTransac}/>
    </>
  );
};
