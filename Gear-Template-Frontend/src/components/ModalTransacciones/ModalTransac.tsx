import { CiFilter } from "react-icons/ci";
import { GrClose } from "react-icons/gr";
import { RiSearch2Line } from "react-icons/ri";
import { useState } from "react";
import Db from '../Record/Db.json';

type Transaccion = {
  estado: 'Exitosa' | 'Pendiente' | 'Cancelada';
  tipo: string;
  fecha: string;
  cantidad: number;
  precio: number;
  usuarioTr: string;
};

type Usuario = {
  nombre: string;
  id: number;
  estado_pago: string;
  tipo_transaccion: string;
  cantidad_kw: number;
  total: number;
  transacciones?: Transaccion[];
};

const { registros } = Db;

interface Modaltransac {
  showTransac: boolean;
  setShowTransac(showTransac: boolean): void;
}

function ModalTransac({ showTransac, setShowTransac }: Modaltransac) {

  const [searchName, setSearchName] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<Usuario[]>([]);
  const [notfound, setNotfound] = useState<boolean>(false);

  const buscarUsuarios = () => {
    const usersFound = registros.filter((usuario) =>
      usuario.nombre.toLowerCase().startsWith(searchName.toLowerCase())
    );

    // @ts-ignore
    setFoundUsers(usersFound);
    setNotfound(true);
  };


  function getEstadoClass(estado: Transaccion['estado']): string {
    switch (estado) {
      case 'Exitosa':
        return 'text-green-500 w-[18%] flex justify-center items-center'; 
      case 'Pendiente':
        return 'text-yellow-500 w-[18%] flex justify-center items-center';
      case 'Cancelada':
        return 'text-red-500 w-[18%] flex justify-center items-center';
      default:
        return '';
    }
  }

  return showTransac ? (
    <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col justify-start items-center bg-slate-50 h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
        <div className="text-[#000000] text-2xl flex justify-end w-full">
          <button
            type="button"
            onClick={() => {
              setShowTransac(false);
              setFoundUsers([]);
              setNotfound(false);
            }}
          >
            <GrClose />
          </button>
        </div>

        <h1 className="text-[#000000] text-xl md:text-2xl mb-6">
          Administrar Transacciones
        </h1>

        <div className="w-full h-10 flex flex-wrap justify-around items-center md:pl-10">
          <div className="w-[60%] flex flex-grow justify-center lg:justify-start items-center">
            <input
              className="w-[75%] sm:w-[50%] md:w-[75%] h-10 text-[#292929] px-2 border-2 "
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Ej. Ana Rodriguez"
            />
            <button
              type="button"
              className="flex justify-center items-center text-[#636264] text-3xl ml-2"
              onClick={() => { buscarUsuarios(); setSearchName(""); }}
            >
              <RiSearch2Line />
            </button>
          </div>

          <div className="w-[50%] lg:w-[40%] h-10 text-sm flex flex-row flex-grow justify-center lg:justify-end items-center pr-2 mt-2 lg:mt-0">
            <div className="text-[#5A5A5A] w-20 h-10 mr-4 border-2 flex justify-center items-center">                
              <select name="" id="" className="bg-slate-50">
                <option value="">Compra</option>                 
                <option value="">Venta</option>
              </select>
            </div>

            <div className="text-[#5A5A5A] w-20 h-10 mr-4 border-2 flex justify-center items-center">                
              <select name="" id="" className="bg-slate-50">
                <option value="">Estado</option>
                <option value="">Activo</option>
                <option value="">Inactivo</option>                 
              </select>
            </div>   

            <div className="text-[#5A5A5A] w-20 h-10 mr-4 border-2 flex justify-center items-center">                
              <select name="" id="" className="bg-slate-50">
                <option value="">Fecha</option>                 
              </select>
            </div>           

            <div className="text-black text-3xl w-10 h-10 mr-4 flex justify-center items-center">
              <button type="button">
                <CiFilter />
              </button>
            </div>
          </div>         
        </div>

        {notfound && foundUsers.length === 0 && <p className="text-black w-full">No se encontraron usuarios</p>}     

        {foundUsers.length > 0 && (
          <div className="flex flex-col w-full  h-auto py-4 mt-10 lg:mt-4 text-xs sm:text-[14px] max-h-[56vh] md:max-h-[66vh] overflow-y-auto">
            {foundUsers.map((usuario) => (
              <div key={usuario.id} className="flex flex-col text-black">
                {usuario.transacciones && usuario.transacciones.map((transaccion, index) => (
                  <div key={usuario.id} className="flex flex-row justify-center text-black border-2 h-20">
                    <div className="w-[28%] flex flex-col justify-center items-center">
                      <h1 className=""><strong>{usuario.nombre}</strong></h1>
                      <h1 className="">{transaccion.usuarioTr}</h1>
                    </div>
                    <h1 className={getEstadoClass(transaccion.estado)}>{transaccion.estado}</h1>
                    <h1 className="w-[18%] flex justify-center items-center">{transaccion.tipo}</h1>
                    <h1 className="w-[18%] flex justify-center items-center">{transaccion.cantidad} Kw</h1>
                    <div className="w-[18%] flex flex-col justify-center items-center">
                      <h1 className="font-semibold">$ {transaccion.precio}</h1>
                      <h1 className="">{transaccion.fecha}</h1>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <button type="button" className="mt-14 lg:mt-4 text-[#2f2f2f] bg-slate-200 w-36 h-10 rounded-sm">
          Ver Disputas
        </button>
            
      </div>
    </div>
  ) : null;
}

export { ModalTransac };
