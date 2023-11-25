import { CiFilter } from "react-icons/ci"; 
import { GrClose } from "react-icons/gr";
import { RiSearch2Line } from "react-icons/ri";

interface MoodalGenerad {
  showGenerad: boolean;
  setShowGenerad(showGenerad: boolean): void;
}

function ModalGenerad({ showGenerad, setShowGenerad }: MoodalGenerad) {
  return showGenerad ? (
    <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col justify-start items-center bg-slate-50 h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
        <div className="text-[#000000] text-2xl flex justify-end w-full">
          <button
          type="button"
            onClick={() => {
              setShowGenerad(false);
            }}
          >
            <GrClose />
          </button>
        </div>

        <h1 className="text-[#000000] text-xl md:text-2xl mb-6">
          Administrar Generadores
        </h1>

        <div className="w-full h-10 flex flex-wrap justify-around items-center md:pl-10">

          <div className="w-[60%] flex flex-grow justify-center lg:justify-start items-center">
            <input
              className="w-[75%] sm:w-[50%] md:w-[75%] h-10 text-[#292929] px-2 border-2 "
              type="text"
              defaultValue="Vertical Wind Turbine"
              placeholder=""
              />
            <button type="button" className=" flex justify-center items-center text-[#636264] text-3xl ml-2">
              <RiSearch2Line />
            </button>
          </div>


          <div className="w-[50%] lg:w-[40%] h-10 text-sm flex flex-row justify-center lg:justify-end items-center pr-2 mt-2 lg:mt-0">
            <div className="text-[#5A5A5A] w-20 h-10 mr-4 border-2 flex justify-center items-center">                
              <select name="" id="" className="bg-slate-50">
                <option value="">Eolico</option>                 
                <option value="">Solar</option>
              </select>
            </div>

            <div className="text-[#5A5A5A] w-20 h-10 mr-4 border-2 flex justify-center items-center">                
              <select name="" id="" className="bg-slate-50">
                <option value="">Activo</option>
                <option value="">Inactivo</option>                 
              </select>
            </div>           

            <div className="text-black text-3xl w-10 h-10 mr-4 flex justify-center items-center">
              <button type="button">
                <CiFilter />
              </button>
            </div>
          </div>         

        </div>

        <div className="p-4 mt-20 lg:mt-8 border-2 lg:w-[70%]">
          <h2 className="text-[#5A5A5A] text-xl mb-6">
            Vertical Wind Turbine Generator, 3000 Win...
          </h2>

          <p className="text-[#5A5A5A] text-[13px]">
            <strong>Tipo de Dispositivo: </strong> Generador Eolico
          </p>

          <p className="text-[#5A5A5A] text-[13px]">
            <strong>Capacidad de producion: </strong> 100 kWh
          </p>

          <p className="text-[#5A5A5A] text-[13px]">
            <strong>Estado: </strong> Activo
          </p>  
       

          <button type="button" className="text-[#5A5A5A] text-[12px] flex justify-end w-full">
            Desactivar
          </button>                 
        </div>

      </div>
    </div>
  ) : null;
}

export {ModalGenerad};