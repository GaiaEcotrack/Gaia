import { RiSearch2Line } from 'react-icons/ri';
import { AiOutlinePlus } from 'react-icons/ai';
import { useState } from 'react';

import Db from '../Record/Db.json';

type Usuario = {
  nombre: string;
  id: number;
  estado_pago: string;
  tipo_transaccion: string;
  cantidad_kw: number;
  total: number;
};

const { registros } = Db;

interface MoodalMantenProps {
  showManten: boolean;
  setShowManten(showManten: boolean): void;
}

function ModalManten({ showManten, setShowManten }: MoodalMantenProps) {
  const [searchName, setSearchName] = useState<string>('');
  const [foundUsers, setFoundUsers] = useState<Usuario[]>([]);
  const [notfound, setNotfound] = useState<boolean>(false);

  const buscarUsuarios = () => {
    const usuariosEncontrados = registros.filter((usuario) =>
      usuario.nombre.toLowerCase().startsWith(searchName.toLowerCase())
    );

    setFoundUsers(usuariosEncontrados);
    setNotfound(true);
  };

  return showManten ? (
    <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
      <div className="flex flex-col justify-start items-center bg-slate-50 h-[100%] md:h-full w-full md:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
        <div className="text-[#000000] text-2xl flex justify-end w-full">
          <button
            type="button"
            onClick={() => {
              setShowManten(false);
              setFoundUsers([]);
              setNotfound(false);
            }}
          >
            <svg width="18" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.09587 0H1.74672C0.197316 0 -0.585701 1.88261 0.513878 2.98219L10.0602 12.5285C12.7925 15.2608 17.2075 15.2608 19.9398 12.5285L29.4861 2.98219C30.5857 1.88261 29.8027 0 28.2533 0H25.9042C24.5214 0 23.1885 0.54979 22.2056 1.53275L16.2412 7.49713C15.5581 8.1802 14.4585 8.1802 13.7755 7.49713L7.81109 1.53275C6.81147 0.54979 5.47868 0 4.09587 0Z" fill="#A7A4B2"/>
              <path d="M4.09587 33.268H1.74672C0.197316 33.268 -0.585701 31.3856 0.513878 30.286L10.0602 20.7396C12.7925 18.0074 17.2075 18.0074 19.9398 20.7396L29.4861 30.286C30.5857 31.3856 29.8027 33.268 28.2533 33.268H25.9042C24.5214 33.268 23.1885 32.7182 22.2056 31.7353L16.2412 25.7709C15.5581 25.0878 14.4585 25.0878 13.7755 25.7709L7.81109 31.7353C6.81147 32.7182 5.47868 33.268 4.09587 33.268Z" fill="#A7A4B2"/>
            </svg>
          </button>
        </div>

        <h1 className="text-[#000000] text-xl md:text-2xl mb-6">System Manage</h1>

        <h1 className="text-[#000000] md:w-full text-lg md:mb-2">Updates</h1>

        <div className="text-[#000000] flex justify-between items-center border-2 w-full h-20 text-xl md:text-lg mb-6 px-2 md:px-0">
          <h1 className="hidden md:flex text-slate-50 w-20">a</h1>
          <h1 className="flex justify-center items-center text-[#757376] h-14 md:pl-0">UPDATE GAIA 2.0</h1>
          <button type="button" className="text-sm md:w-20">
            Update
          </button>
        </div>

        <h1 className="text-[#000000] md:w-full text-lg md:text-lg mb-4 md:mb-6">User Gestion</h1>

        <div className="flex flex-row flex-wrap w-full">
          <h1 className="hidden md:flex justify-start text-slate-50 md:text-[#757376] text-md md:text-md md:mb-2 w-[50%]">
            Search for user on the Gaia network
          </h1>
          <h1 className="hidden md:flex justify-end text-slate-50 md:text-[#757376] text-md md:text-md md:mb-2 w-[50%]">
            Create new user
          </h1>

          <input
            type="text"
            className="md:mb-2 w-[60%] md:w-[45%] text-[#292929] px-2 border-2"
            placeholder=""
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button
            type="button"
            className="w-[6%] flex justify-center items-center text-[#636264] text-3xl md:mb-2"
            onClick={() => {
              buscarUsuarios();
              setSearchName('');
            }}
          >
            <RiSearch2Line />
          </button>

          <button type="button" className="text-[#515052] text-4xl md:mb-2 w-[25%] md:w-[45%] flex justify-end pr-[2%]">
            <AiOutlinePlus />
          </button>
        </div>

        {notfound && foundUsers.length === 0 && <p className="text-black w-full">No users found</p>}

        {foundUsers.length > 0 && (
          <div className="flex flex-col w-full h-[30%] pt-2 mt-2 text-xs sm:text-[14px] overflow-y-auto">
            {foundUsers.map((usuario) => (
              <div key={usuario.id} className="flex flex-row justify-center items-center text-black border-2">
                <h1 className="w-[28%] h-8 flex justify-center items-center">{usuario.nombre}</h1>
                <h1 className="w-[18%] flex justify-center items-center">Id: {usuario.id}</h1>
                <button type="button" className="w-[18%] underline font-semibold">
                  Asignar rol
                </button>
                <button type="button" className="w-[18%] underline font-semibold">
                  Editar
                </button>
                <button type="button" className="w-[18%] underline font-semibold">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="w-full mt-10">
          <div className="text-[#000000] text-[12px] md:text-[13px] flex flex-col justify-start items-start underline">
            <button type="button" className="mb-2">
            Monitor security measures
            </button>
            <button type="button" className="mb-2 cursor-pointer">
            Monitor and manage resources
            </button>
            <button type="button" className="mb-2 cursor-pointer">
              Start Gaia Backup
            </button>
            <button type="button" className="mb-2 cursor-pointer">
              Start auditory
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export type { Usuario };
export { ModalManten };