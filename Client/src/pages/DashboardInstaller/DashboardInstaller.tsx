import axios from 'axios';
import { useState, useEffect } from 'react';
import { HiOutlineLogout } from "react-icons/hi"; 
import Users from "./components/Users";
import UsersList from "./components/UsersList";
import UsersPayments from "./components/UsersPayments";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserForm from './components/ProfileInstaller';

interface User {
  name: string;
  generatedKW: number
}

const DashboardInstaller = () => {
  const auth = getAuth();
  const savedCompanyName = localStorage.getItem('companyName');
  const [cardUser, setcardUser] = useState(true)
  const [userOnline, setUserOnline] = useState([])
  const [profileCard, setProfileCard] = useState(false)
  const [cardUserPayment, setCardUserPayment] = useState(false)
  const [users, setUsers] = useState<User[]>([]);
  const [photoProfile, setPhotoProfile] = useState<string | null>(null);
  const apiExpress = import.meta.env.VITE_APP_API_EXPRESS
  const username=import.meta.env.VITE_APP_ADMIN_USER
  const password=import.meta.env.VITE_APP_ADMIN_PASSWORD
  const currentUser = auth.currentUser?.email
  console.log(currentUser);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Paso 1: Obtener el token desde la ruta de autenticación
        const loginResponse = await axios.post(`${apiExpress}/auth/login`, {
          username: username, 
          password: password  
        });
    
        const token = loginResponse.data.token;
    
        // Paso 2: Almacenar el token en el localStorage
        localStorage.setItem('token', token);
    
        // Paso 3: Usar el token para realizar la petición a la otra ruta
        const response = await axios.get(`${apiExpress}/generator/byinstaller/${userOnline.installer_company}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        const data = response.data;
        setUsers(data);
    
      } catch (error) {
        console.log(error);
      }
    };
    const fetchType = async () => {
      try {
        // Paso 1: Obtener el token desde la ruta de autenticación
        const loginResponse = await axios.post(`${apiExpress}/auth/login`, {
          username: username, 
          password: password  
        });
    
        const token = loginResponse.data.token;
    
        // Paso 2: Almacenar el token en el localStorage
        localStorage.setItem('token', token);
    
        // Paso 3: Usar el token para realizar la petición a la otra ruta
        const response = await axios.get(`${apiExpress}/users/search`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            email: currentUser // Aquí pasas el filtro por email
          }
        });
    
        const user = response.data; // Obtiene el usuario desde la respuesta
        setUserOnline(user)
        
    
      } catch (error) {
        console.log(error);
      }
    };
    fetchType()  
    fetchUsers();

    const photo_profile = localStorage.getItem('profilePic');
    setPhotoProfile(photo_profile);
  }, [apiExpress]);

  const openCardUser = ()=>{
    setCardUserPayment(false)
    setcardUser(true)
    setProfileCard(false)
  }

  const openCardPayment = ()=>{
    setCardUserPayment(true)
    setcardUser(false)
  }

  const openProfile = ()=>{
    if(userOnline.role === "Installer"){
      setCardUserPayment(false)
      setcardUser(false)
      setProfileCard(true)
    }
    else if(userOnline.role === "Comercial"){
      setCardUserPayment(false)
      setcardUser(false)
      setProfileCard(false)
    }
  }


  const signOutWithoutAuth = async () => {
    await signOut(auth);
    localStorage.clear()
  };
console.log(userOnline);

  

  return (
    <div className="h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white dark:bg-gray-700 text-black">
      <div className="fixed w-full flex items-center justify-between h-14 bg-gray-800 text-white z-50">
        <div className="flex items-center justify-start md:justify-center pl-3 w-14 md:w-64 h-14 bg-gray-800 dark:bg-gray-800 border-none">
          {photoProfile && (
            <img
              className="w-7 h-7 md:w-10 md:h-10 mr-2 rounded-md overflow-hidden"
              alt="Profile"
              src="https://images.unsplash.com/photo-1546881963-ac8d67aee789?q=80&w=1358&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          )}
          <span className="hidden md:block text-white text-xl ml-1">Hola</span>
        </div>

        <div className="flex justify-between items-center h-14 bg-blue-800 dark:bg-gray-800 header-right">
          <div className="flex items-center justify-center mr-4 hover:text-blue-100">
            <Link to="/">                  
              <button className="inline-flex mr-1 justify-center items-center text-lg"
                type="button"
                onClick={signOutWithoutAuth}>
                <HiOutlineLogout className="text-2xl flex justify-center mr-1"/>
                Logout              
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* SIDEBAR */}
      <div className="fixed flex flex-col top-14 left-0 w-14 hover:w-64 md:w-64 bg-blue-900 dark:bg-gray-900 h-full text-white transition-all duration-300 border-none z-10 sidebar">
        <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                  Main
                </div>
              </div>
            </li>
            <li>
              <button
              onClick={()=>openCardUser()}
                className="relative flex flex-row items-center h-11 w-full focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Users
                </span>
              </button>
            </li>
            {/* <li>
              <button onClick={()=>{openCardPayment()}} className="relative flex flex-row items-center h-11 w-full focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  payment
                </span>
                <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-blue-500 bg-indigo-50 rounded-full">
                  New
                </span>
              </button>
            </li> */}

            {/* <li>
              <a
                // href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Messages
                </span>
              </a>
            </li> */}

            {/* <li>
              <a
                // href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Notifications
                </span>
                <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full">
                  1.2k
                </span>
              </a>
            </li> */}

            <li className="px-5 hidden md:block">
              <div className="flex flex-row items-center mt-5 h-8">
                <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                  Settings
                </div>
              </div>
            </li>
            <li>
              <a
                // href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </span>
                <button onClick={openProfile} className="ml-2 text-sm tracking-wide truncate">
                  Profile
                </button>
              </a>
            </li>
            <li>
              <a
                // href="/"
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800 dark:hover:bg-gray-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  Settings
                </span>
              </a>
            </li>
          </ul>
          <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
            Copyright @2024
          </p>
        </div>
      </div>
      {/* SIDEBAR */}

      {/* CARDS */}
      <div className="h-full ml-14 mt-14 mb-10 md:ml-64 bg-white">
        {cardUser && (
          <div>
            <Users users={users}/>
            <UsersList users={users}/>
          </div>
        )}
        {profileCard && (
          <div>
            <UserForm/>
          </div>
        )}

        {cardUserPayment && (
          <div>
            <UsersPayments />
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardInstaller;
