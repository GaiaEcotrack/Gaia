import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";


interface UserType {
  email: string;
  username: string;
  nombre_apellidos: string;
  telefono: string;
  _id: string;
}

const DashBoard = () => {


  const nuevoNombreUsuarioRef = useRef(null);
  const nuevoCorreoElectronicoRef = useRef(null);
  
  const [users, setUsers] = useState<UserType[]>([]);
  const [confirm, setConfirm] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const callUsers = async () => {
      try {

        const response = await axios("http://localhost:5000/users/");
        const allUsers = response.data;
        setUsers(allUsers.users);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    callUsers();
  }, []);

  const handleUpdateUser = async (userId: string, updatedUserData: Partial<UserType>) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}`, updatedUserData);
      const updatedUser = response.data.updatedUser;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...updatedUser } : user
        )
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

    const handleDeleteUser = async (userId: string) => {
      try {
        
         axios.delete(`http://localhost:5000/users/${userId}`)
         setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
      }
    }

  return (
    <div className=''>
     <div
      id="view"
      className="h-full w-screen md:w-full flex flex-row"
      x-data="{ sidenav: true }"
    >
      <button
        // @click="sidenav = true"
        className="p-2 border-2 bg-white rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-teal-500 focus:outline-none focus:text-white absolute top-0 left-0 sm:hidden"
      >
        <svg
           className="w-5 h-5 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </button>
      <div
        id="sidebar"
        className=" fixed bg-white h-screen  hidden md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
        x-show="sidenav"
       // @click.away="sidenav = false"
      >
        <div className="space-y-6 md:space-y-10 mt-2 ">
          <h1  className="font-bold text-4xl text-center md:hidden">
            D<span className="text-teal-600">.</span>
          </h1>
          <h1  className="hidden md:block font-bold text-sm md:text-xl text-center">
            Dashwind<span  className="text-teal-600">.</span>
          </h1>
          <div id="profile" className="space-y-3">
            <img
              src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
              alt="Avatar user"
              className="w-10 md:w-16 rounded-full mx-auto"
            />
            <div>
              <h2
                className="font-medium text-xs md:text-sm text-center text-[#26254f]"
              >
                Eduard Pantazi
              </h2>
              <p  className="text-xs text-gray-500 text-center">Administrator</p>
            </div>
          </div>
          <div
             className="flex border-2 border-gray-200 rounded-md focus-within:ring-2 ring-teal-500"
          >
            <input
              type="text"
              className="w-full rounded-tl-md rounded-bl-md px-2 py-3 text-sm text-gray-600 focus:outline-none"
              placeholder="Search"
            />
            <button
              className="rounded-tr-md rounded-br-md px-2 py-3 hidden md:block"
            >
              <svg
                className="w-4 h-4 fill-current"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div id="menu" className="flex flex-col space-y-2">
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
            >
              <svg
                className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                ></path>
              </svg>
              <span className="">Users</span>
            </a>
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                 className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"
                ></path>
              </svg>
              <span className="">Plants</span>
            </a>
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                 className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="">Reports</span>
            </a>
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                 className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"
                ></path>
                <path
                  d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"
                ></path>
              </svg>
              <span className="">Messages</span>
            </a>
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="">Calendar</span>
            </a>
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                 className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="">Table</span>
            </a>
            <a
              href=""
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
            >
              <svg
                className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
                ></path>
              </svg>
              <span className="">UI Components</span>
            </a>
            <a
              className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-[#26254f] hover:text-white hover:scale-105 rounded-md transition duration-150 ease-in-out"
              >
              <svg
                className="w-6 h-6 fill-current inline-block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
                ></path>
              </svg>
              <span className="">Products</span>
            </a>
          </div>
        </div>

      </div>
     
      <div
          className="flex justify-center items-center  md:w-[130vh] h-full rounded-tr md:ml-[50vh]   bg-[#18174584]"
          >
          <div className=''>
          {users.map(user => (
            <div className='flex flex-wrap bg-[#26254f] rounded-tr m-3'>
              <img className='w-12 h-12 rounded-full ml-4 mt-4' src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" />
           <div className='ml-2'>
              <h1>Username :{user.username}</h1>  
              <h1>Email: {user.email}</h1>
              <p>Names and lastNames : {user.nombre_apellidos}</p>
              <p>phone : {user.telefono}</p>
              <div className='ml-[50vh]'>
              <MdOutlineDeleteForever onClick={() => handleDeleteUser(user._id)} className='text-red-500 text-lg transition-transform transform hover:scale-110 cursor-pointer ml-[-3.5vh]'/>
              </div>
             {confirm[user._id] && (
                <div className="mt-5 w-[25vh] ml-12">
                  <input
                    ref={nuevoNombreUsuarioRef}
                    type="text"
                    placeholder="Nuevo nombre de usuario"
                    className="mr-2 m-1"
                  />
                  <input
                    ref={nuevoCorreoElectronicoRef}
                    type="text"
                    placeholder="Nuevo correo electrónico"
                    className="mr-2 m-1"
                  />
                  {/* Agrega otros campos según sea necesario */}
                  <button
                    onClick={() => {
                      const nuevoNombreUsuario = nuevoNombreUsuarioRef.current.value;
                      const nuevoCorreoElectronico = nuevoCorreoElectronicoRef.current.value;
       
                      handleUpdateUser(user._id, {
                        username: nuevoNombreUsuario || user.username,
                        email: nuevoCorreoElectronico || user.email,
                        // Agrega otros campos según sea necesario
                      });
       
                      setConfirm(false);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 mt-2 rounded-md cursor-pointer"
                  >
                    Actualizar
                  </button>
                  <button onClick={() => setConfirm(false)} className="bg-red-500 mt-2 text-white px-2 py-1 rounded-md cursor-pointer ml-2">
                    Cancelar
                  </button>
                </div>
              )}
           </div>
           <div>
           <button
           onClick={() => setConfirm((prevConfirm) => ({ ...prevConfirm, [user._id]: !prevConfirm[user._id] }))}
             className="text-blue-500 text-lg transition-transform transform hover:scale-110 cursor-pointer ml-[-3.5vh]"
            >
               <FaRegEdit />
         </button>
             
              </div>
            </div>
          ))}
          </div>
        </div>
    </div>
    </div>
  )
}

export default DashBoard
