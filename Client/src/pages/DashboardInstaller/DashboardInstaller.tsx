import axios from 'axios';
import { useState, useEffect } from 'react';
import { HiOutlineLogout } from "react-icons/hi"; 
import Users from "./components/Users";
import UsersList from "./components/UsersList";
import UsersPayments from "./components/UsersPayments";
import { Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserForm from './components/ProfileInstaller';
import { AccountInfo } from '@/components/layout/header/account-info/account-info';
import CreateWallet from './components/CreateWallet';
import ModalDevice from './components/modalDevice';

interface User {
  name: string;
  generatedKW: number
}

const DashboardInstaller = () => {
  const auth = getAuth();
  const [cardUser, setcardUser] = useState(true)
  const [userOnline, setUserOnline] = useState([])
  const [profileCard, setProfileCard] = useState(false)
  const [cardUserPayment, setCardUserPayment] = useState(false)
  const [modal, setModal] = useState(false)
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
        const response = await axios.get(`${apiExpress}/generator/byinstaller/${userOnline.installation_company
        }`, {
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
    if (userOnline.installation_company !== undefined) {
      fetchUsers();
    }
     

    const photo_profile = localStorage.getItem('profilePic');
    setPhotoProfile(photo_profile);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ apiExpress,userOnline.installation_company]);

  const openCardUser = ()=>{
    setCardUserPayment(false)
    setcardUser(true)
    setProfileCard(false)
  }

  // const openCardPayment = ()=>{
  //   setCardUserPayment(true)
  //   setcardUser(false)
  // }

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

  const openModal= ()=>{
    setModal(true)
  }
  const closeModal= ()=>{
    setModal(false)
  }


  const signOutWithoutAuth = async () => {
    await signOut(auth);
    localStorage.clear()
  };
console.log(userOnline);

  

  return (
    <div className="min-h-screen flex flex-col antialiased bg-white dark:bg-gray-700 text-black">
    {/* HEADER */}
    <div className="fixed w-full flex items-center justify-between h-14 bg-gray-800 text-white z-50">
      <div className="flex items-center pl-3 w-14 md:w-64 h-14 bg-gray-800 dark:bg-gray-800">
        {photoProfile && (
          <img
            className="w-7 h-7 md:w-10 md:h-10 mr-2 rounded-md"
            alt="Profile"
            src="https://images.unsplash.com/photo-1546881963-ac8d67aee789?q=80&w=1358&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        )}
        <span className="hidden md:block text-white text-xl ml-1">
          {userOnline.installation_company ? userOnline.installation_company : 'installer'}
        </span>
      </div>

      <div className="flex items-center justify-end h-14 pr-4 bg-blue-800 dark:bg-gray-800">
        <button
          className="flex items-center text-lg hover:text-blue-100"
          onClick={signOutWithoutAuth}
        >
          <HiOutlineLogout className="text-2xl mr-1" />
          Logout
        </button>
      </div>
    </div>

    {/* SIDEBAR */}
    <div className="fixed top-14 left-0 w-14 hover:w-64 md:w-64 h-full bg-blue-900 dark:bg-gray-900 text-white transition-all duration-300 z-10 sidebar">
      <div className="flex flex-col h-full">
        <ul className="flex flex-col py-4 space-y-1 overflow-y-auto">
          <li className="px-5 hidden md:block">
            <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Main</div>
          </li>
          <li>
            <button
              onClick={openCardUser}
              className="flex items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm truncate">Users</span>
            </button>
          </li>

          <li className="px-5 hidden md:block">
            <div className="text-sm font-light tracking-wide text-gray-400 uppercase">Settings</div>
          </li>
          <li>
            <button
              className="flex items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6"
              onClick={openProfile}
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm truncate">Profile</span>
            </button>
          </li>

          <li>
            <button className="flex items-center h-11 hover:bg-blue-800 dark:hover:bg-gray-600 text-white border-l-4 border-transparent hover:border-blue-500 dark:hover:border-gray-800 pr-6">
              <span className="inline-flex justify-center items-center ml-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </span>
              <span className="ml-2 text-sm truncate">Settings</span>
            </button>
            <div className="flex z-10">
              <AccountInfo />
              <h1 className="absolute text-slate-400 hover:text-white font-normal text-sm items-center ml-[50px] mt-2" style={{ minWidth: '150px' }}>
                Wallet Connection
              </h1>
            </div>
          </li>
        </ul>
        <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">Copyright @2024</p>
      </div>
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-grow ml-14 md:ml-64 mt-14 mb-10 bg-white">
      {cardUser && (
        
        <div>
          <CreateWallet />
          <Users users={users} />
          <UsersList users={users} />
        </div>
      )}
      {profileCard && (
        <div>
          <UserForm />
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
