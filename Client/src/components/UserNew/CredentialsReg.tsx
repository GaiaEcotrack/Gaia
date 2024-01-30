
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CredentialsReg () {

  const URL = import.meta.env.VITE_APP_API_URL
  const foundUserId = localStorage.getItem("id")

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (foundUserId) {
      axios.get(`${URL}users/${foundUserId}`)
        .then(response => {
          const userData = response.data;
          setFormData({
            username: userData.username || '',
            password: userData.password || '',
          });
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  }, [foundUserId]);


// **********************************************************

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    let apiUrl = `${URL}users/`;
    let httpMethod = 'POST';

    if (userId) {
      // Si hay un ID en el localStorage, es una actualización (PUT)
      apiUrl += `${userId}`;
      httpMethod = 'PUT';
    }

    const response = await fetch(apiUrl, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Usuario agregado/actualizado con éxito:', data);

      // Guardar el ID en el localStorage si es un nuevo usuario
      if (!userId) {
        localStorage.setItem('id', data.id);
      }
    } else {
      console.error('Error al agregar/actualizar usuario:', response.statusText);
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
};


  return (
    <div className=" w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-white">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Register</h2>

          <Link to="/userReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              User Register
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-center px-3 py-2.5 font-bold bg-white text-black border rounded-full">
              Credentials
            </h1>
          </Link>

          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
              PRO Account
            </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">

          <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            DEVICE CREDENTIALS
          </h2>         

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-4" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="usernameCre"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Username
                </label>
                <input
                  onChange={handleInputChange}
                  name="username"
                  type="text"
                  id="usernameCre"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Username"
                  value={formData.username}                 
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="passwordCre"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Password
                </label>
                <input
                  onChange={handleInputChange}
                  name="password"
                  type="text"
                  id="passwordCre"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Password"
                  value={formData.password} 
                  required
                />
              </div>              

              <div className="flex justify-start w-full">
                <button
                  type="submit"
                  className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-28"
                >
                  Save
                </button>
              </div> 
            </form>
          </div>
        </div>
      </main>

      <div className="md:hidden sticky flex flex-col gap-2 p-4 text-sm top-10 mb-8">
        <h2 className="pl-3 mb-4 text-2xl font-semibold">Settings</h2>
        <Link to="/userReg">
          <h1 className="flex items-center px-3 py-2.5 font-bold bg-white text-black border rounded-full">
            User Register
          </h1>
        </Link>

        <Link to="/deviceReg">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Device Register
          </h1>
        </Link>

        <Link to="/CredentialsReg">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Credentials
          </h1>
        </Link>

        <Link to="/NotificacionesConfig">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            Notifications
          </h1>
        </Link>

        <Link to="/account">
          <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
            PRO Account
          </h1>
        </Link>
      </div>
    </div>
  );
}

export { CredentialsReg };
