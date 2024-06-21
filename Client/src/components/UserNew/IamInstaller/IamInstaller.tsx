import React from 'react'
import { Link } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
function IamInstaller() {

  const [email, setEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState('');
  const URL = import.meta.env.VITE_APP_API_URL
  // const apiExpress = import.meta.env.VITE_APP_API_EXPRESS

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const [formData, setFormData] = useState({
    installation_company: null,
    role: "Installer" 
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || '');    
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${URL}/users/search`, {
        params: {
          email: email,
        },
      });      
      if (response.status === 200) {
        setFoundUserId(response.data._id);        
      } else if (response.status === 404) {
        setFoundUserId('');
        console.log('Usuario no encontrado');
      } else {
        console.error('Error al buscar usuario:');
      }
    } catch (error) {
      // console.error('Error de red:');
    }
  };
  localStorage.setItem("id", foundUserId); 

  useEffect(() => {
    if (foundUserId) {
      axios.get(`${URL}/users/${foundUserId}`)
        .then(response => {
          const userData = response.data.user;
          setFormData({
            installation_company: userData.installation_company || null,
            role: "Installer" 
          }); 
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundUserId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Datos del formulario a enviar:', formData);
  
    try {
      const userId = localStorage.getItem('id');
  
      let apiUrl = `${URL}/users/${userId}`;
      let httpMethod = 'PUT';
  
      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "User updated successfully"
        }); 
  
        if (!userId) {
          Toast.fire({
            icon: "error",
            title: "Something went wrong"
          });
        }
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong"
        });
      }
    } catch (error) {
      // console.error('Error de red:', error);
    }
  };

  return (
    <div className=" w-full bg-white flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black">
     
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 text-black mb-4 text-2xl font-semibold">Profile</h2>

          <Link to="/userReg">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              User Account
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Credentials
            </h1>
          </Link>

          <Link to="/idVerification">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Identification
            </h1>
          </Link>

          <Link to="/security">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Security Settings
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/IamInstaller">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              I am Installer
            </h1>
          </Link>
          
          <Link to="/notifications">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

        </div>
      </aside>

      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">

          <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            I BELONG TO AN INSTALLATION COMPANY 
          </h2>         

          {/* Formulario de perfil público */}
          <div className="">
            <form className="grid sm:grid-cols-2 gap-x-14" action="" onSubmit={handleSubmit}>
             
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="installation_company"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Installation Company
                </label>
                <select
                  onChange={handleInputChange}
                  name="installation_company"
                  id="installation_company"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  value={formData.installation_company || ''}
                  required
                >
                  <option value="" disabled>Select Installation Company</option>
                  <option value="Fibra_Andina">Fibra Andina</option>
                  <option value="Green_house">Green house</option>
                  <option value="Proselec">Proselec</option>
                  <option value="Fullenergysolar">Fullenergysolar</option>
                </select>
              </div>

              <div>
                {/* Comodin */}
              </div>           

              <div className="flex justify-start w-full">
                <button
                  type="submit"
                  className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-28 mt-4"
                >
                  Save
                </button>
              </div> 
            </form>
          </div>
        </div>
      </main>



     

    </div>
  );
}

export default IamInstaller