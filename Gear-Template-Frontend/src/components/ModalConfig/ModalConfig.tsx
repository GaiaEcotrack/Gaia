import { GrClose } from "react-icons/gr"; 

interface MoodalConfig {
  showConfig: boolean;
  setShowConfig(showConfig: boolean): void;
}

function ModalConfig(props:MoodalConfig) {
  const { showConfig, setShowConfig } = props;
    return showConfig ? (
      <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-slate-50 h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
          
          <div className="text-[#000000] text-2xl flex justify-end w-full">
            <button
            type="button"
            onClick={() => {setShowConfig(false)}}            
            >
            <GrClose />
            </button>          
          </div>
        
          <h1 className="text-[#000000] text-xl md:text-2xl md:mb-6">
            Configuracion del Sistema
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 md:gap-y-10 mt-6 2xl:mt-10 max-h-[70vh] overflow-y-auto">

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Parámetros de red</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Establecer limite de capacidad de red</li>
                <li>Establecer limite de transferencias de datos</li>
                <li>Configuraciones de seguridad</li>
              </ul>
            </div>            

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Integracion de Blockchain</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Configurar nodos</li>
                <li>Gestionar direcciones de billetera</li>
                <li>Sincronizacion de Algorand y supervision de la Blockchain</li>
              </ul>
            </div>

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Gestión de Tokens</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Crear Tokens</li>
                <li>Asignar Tokens</li>
                <li>Monitorizacion de transacciones de Tokens en la red</li>
              </ul>
            </div>

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Seguridad y privacidad</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Establecer limite de capacidad de red</li>
                <li>Establecer limite de transferencias de datos</li>
                <li>Configuraciones de seguridad</li>
              </ul>
            </div>

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Mantenimiento y Actualizaciones</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Establecer limite de capacidad de red</li>
                <li>Establecer limite de transferencias de datos</li>
                <li>Configuraciones de seguridad</li>
              </ul>
            </div>

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Registro y Auditoria</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Aceder a registros de actividades criticas</li>
              </ul>
            </div>            

            <div>
              <div className="text-[#000000] text-xs md:text-smflex justify-start w-full font-semibold mb-2">
                <h1>Gestion de usuarios</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>dministrar cuentas de usuario</li>
              </ul>
            </div>

            <div>
              <div className="text-[#000000] text-xs md:text-sm flex justify-start w-full font-semibold mb-2">
                <h1>Soporte y Ayuda</h1>        
              </div>
              <ul className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start w-full pl-8 underline list-disc">
                <li>Recursos de soporte y ayuda</li>
              </ul>
            </div>

          </div>
          
        </div>
      </div>
    ) : null
  } 

  export { ModalConfig };