import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Grapic from "./Grapic";
import panelImg from "./panelImg.png";
import rayo from "./rayo.png";

function PlantsDashboard() {
  const url = import.meta.env.VITE_APP_API_URL;
  const [plants, setPlants] = useState([]);
  const [power, setPower] = useState<number>(getRandomPower());

  
  useEffect(() => {
    const interval = setInterval(() => {
      setPower(getRandomPower());
    }, 5000);

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []); // El segundo argumento del useEffect es un arreglo de dependencias. En este caso, está vacío para que se ejecute solo una vez al montar el componente.


  function getRandomPower() {
    return (Math.random() * (2.5 - 1.5) + 1.5).toFixed(2);
  }

  useEffect(() => {
    const callPlants = async () => {
      const response = await (await axios(`${url}/plants`)).data.plants;
      setPlants(response);
    };

    callPlants();
  }, [url]);  // Agrega la dependencia 'url' al arreglo de dependencias de useEffect

  

  return (
    <div className='min-h-screen'>
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
         
          <div id="menu" className="flex flex-col space-y-2">
            <Link
              to={"/dashboard"}
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
            </Link>
              <Link
                to={"/dashboard/plants"}
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
              </Link>
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
          className="flex justify-center items-center h-screen rounded-tr md:ml-[50vh]  "
          > 

      <div className='w-[120vh] ml-12 mt-[-60vh] dark:bg-[#181745c0] rounded-lg h-[30vh]'>

        <div className='w-[10vh] h-[10vh] bg-white flex justify-center ml-[25vh] mt-10 items-center rounded-full'>
        <img className='w-20 h-20 ml-[-1vh]' src={panelImg} />
        </div>
           <h1 className='ml-[27vh] mt-3'>plants</h1>
           <h1 className='ml-[29vh] mt-2'>{plants && plants.length}</h1>

           
        <div className='w-[10vh] h-[10vh] bg-white flex justify-center ml-[80vh] mt-[-19vh] items-center rounded-full'>
        <img className='w-20 h-20 ml-[-1vh]' src={rayo} />
        </div>
        <h1 className='ml-[81vh] mt-1'>All plants</h1>
        <h1 className='text-4xl ml-[76vh] mt-2'>K/w {power}</h1>
      </div>
    

      <div className='ml-[-130vh] mt-[30vh]'>
      <Grapic  />
      </div>


        </div>
     <div className='dark:bg-[#181745c0] rounded-lg mt-[40vh] ml-12 w-[55vh] h-full'>
      <h1 className='text-lg ml-[25vh]'>Plants</h1>
      <h1 className='ml-[12vh]'>name</h1>
      <h1 className='ml-[25vh] mt-[-3vh]'>ID</h1>
      <h1 className='ml-[38vh] mt-[-3vh]'>Zone</h1>
      <div className='mt-6'>
        {plants.map(plant => (
          <div className='mb-6'>
            <img src="https://m.media-amazon.com/images/I/51HMM0Wa2gS._AC_.jpg" className='w-12 h-12 mb-3 ml-2 rounded-3xl'  />
            <h1 className='ml-[10vh] mt-[-7vh]'>{plant.name}</h1>
            <h1 className='ml-[25vh] mt-[-3.3vh]'>{plant.plantId}</h1>
            <h3 className='ml-[35vh] mt-[-3vh]'>{plant.timezone}</h3>
          </div>
        ))}
      </div>
     </div>
    </div>
    </div>
  )
}

export { PlantsDashboard }
