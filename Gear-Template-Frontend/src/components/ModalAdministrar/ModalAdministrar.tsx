import { useState } from "react";
import { GrClose } from "react-icons/gr";
import {ModalConfig} from "../ModalConfig/ModalConfig";
import {ModalManten} from "../ModalMantenimiento/ModalManten";
import {ModalGenerad} from "../ModalGeneradores/ModalGenerad";
import {ModalTransac} from "../ModalTransacciones/ModalTransac";

interface ModalAdministrarProps {
  showAdmin: boolean;
  setShowAdmin: (showAdmin: boolean) => void;
}

function ModalAdministrar({ showAdmin, setShowAdmin }: ModalAdministrarProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [showManten, setShowManten] = useState(false);
  const [showGenerad, setShowGenerad] = useState(false);
  const [showTransac, setShowTransac] = useState(false);

  return showAdmin ? (
    <>
    <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col justify-start items-center bg-slate-50 h-[400px] w-[320px] rounded-2xl overflow-hidden shadow-lg p-4">

          <div className="text-[#000000] text-2xl flex justify-end w-full">
            <button 
            type="button"
            onClick={() => {setShowAdmin(false)}}            
            >
              <GrClose />
            </button>          
          </div>

          <div>
            <div className="w-[320px] h-full rounded flex flex-col">
              <div className="flex flex-col items-center">           
                <button type="button" onClick={() => {setShowConfig(true)}} className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Configuracion del sistema
                </button>
                
                <button   type="button" onClick={() => {setShowManten(true)}} className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Mantenimiento del sistema
                </button>

                <button  type="button" onClick={() => {setShowGenerad(true)}} className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Administrar generadores
                </button>

                <button  type="button" onClick={() => {setShowTransac(true)}} className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Administrar transacciones
                </button>

                <button  type="button" className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Configuracion de las tarifas
                </button>

                <button type="button" className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Control de la red
                </button>

                <button type="button" className="w-[250px] h-[30px] bg-[#74C7ED] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Informes y Analisis
                </button>           
              </div>
            </div>

          </div>
          
      </div>

    </div>
    <ModalConfig showConfig={showConfig} setShowConfig={setShowConfig}/>
    <ModalManten showManten={showManten} setShowManten={setShowManten}/>
    <ModalGenerad showGenerad={showGenerad} setShowGenerad={setShowGenerad}/>
    <ModalTransac showTransac={showTransac} setShowTransac={setShowTransac}/>
    </>
  ) : null
}

export { ModalAdministrar };
