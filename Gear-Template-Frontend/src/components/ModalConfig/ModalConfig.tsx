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
            <svg width="18" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.09587 0H1.74672C0.197316 0 -0.585701 1.88261 0.513878 2.98219L10.0602 12.5285C12.7925 15.2608 17.2075 15.2608 19.9398 12.5285L29.4861 2.98219C30.5857 1.88261 29.8027 0 28.2533 0H25.9042C24.5214 0 23.1885 0.54979 22.2056 1.53275L16.2412 7.49713C15.5581 8.1802 14.4585 8.1802 13.7755 7.49713L7.81109 1.53275C6.81147 0.54979 5.47868 0 4.09587 0Z" fill="#A7A4B2"/>
              <path d="M4.09587 33.268H1.74672C0.197316 33.268 -0.585701 31.3856 0.513878 30.286L10.0602 20.7396C12.7925 18.0074 17.2075 18.0074 19.9398 20.7396L29.4861 30.286C30.5857 31.3856 29.8027 33.268 28.2533 33.268H25.9042C24.5214 33.268 23.1885 32.7182 22.2056 31.7353L16.2412 25.7709C15.5581 25.0878 14.4585 25.0878 13.7755 25.7709L7.81109 31.7353C6.81147 32.7182 5.47868 33.268 4.09587 33.268Z" fill="#A7A4B2"/>
            </svg>
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