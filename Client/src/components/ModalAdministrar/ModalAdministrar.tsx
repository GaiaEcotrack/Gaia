import { useState } from "react";

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
              <svg width="18" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.09587 0H1.74672C0.197316 0 -0.585701 1.88261 0.513878 2.98219L10.0602 12.5285C12.7925 15.2608 17.2075 15.2608 19.9398 12.5285L29.4861 2.98219C30.5857 1.88261 29.8027 0 28.2533 0H25.9042C24.5214 0 23.1885 0.54979 22.2056 1.53275L16.2412 7.49713C15.5581 8.1802 14.4585 8.1802 13.7755 7.49713L7.81109 1.53275C6.81147 0.54979 5.47868 0 4.09587 0Z" fill="#A7A4B2"/>
              <path d="M4.09587 33.268H1.74672C0.197316 33.268 -0.585701 31.3856 0.513878 30.286L10.0602 20.7396C12.7925 18.0074 17.2075 18.0074 19.9398 20.7396L29.4861 30.286C30.5857 31.3856 29.8027 33.268 28.2533 33.268H25.9042C24.5214 33.268 23.1885 32.7182 22.2056 31.7353L16.2412 25.7709C15.5581 25.0878 14.4585 25.0878 13.7755 25.7709L7.81109 31.7353C6.81147 32.7182 5.47868 33.268 4.09587 33.268Z" fill="#A7A4B2"/>
            </svg>
            </button>          
          </div>

          <div>
            <div className="w-[320px] h-full rounded flex flex-col">
              <div className="flex flex-col items-center">           
                <button type="button" onClick={() => {setShowConfig(true)}} className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Configuracion del sistema
                </button>
                
                <button   type="button" onClick={() => {setShowManten(true)}} className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Mantenimiento del sistema
                </button>

                <button  type="button" onClick={() => {setShowGenerad(true)}} className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Administrar generadores
                </button>

                <button  type="button" onClick={() => {setShowTransac(true)}} className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Administrar transacciones
                </button>

                <button  type="button" className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Configuracion de las tarifas
                </button>

                <button type="button" className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
                  Control de la red
                </button>

                <button type="button" className="w-[250px] h-[30px] bg-[#1d335b] rounded-[5px] text-md text-[#ffffff] mt-4" >
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
