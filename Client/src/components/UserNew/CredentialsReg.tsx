
import axios from "axios";
import { useEffect, useState } from "react";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function CredentialsReg () {

  const [email, setEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState('');
  const [completeCredent, setCompletedCredent] = useState(false);
  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_APP_API_URL

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
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const valueCompleted = localStorage.getItem("completeCredent");
    if(valueCompleted === "false"){
      setCompletedCredent(false);
    }if(valueCompleted === "true"){
      setCompletedCredent(true);
    }
  }, [completeCredent]);

  const [formData, setFormData] = useState({
    credentials: null,
    secret_key: null,
  });

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    setEmail(storedEmail || '');    
    handleSearch();
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
          const userData = response.data;
          setFormData({
            credentials: userData.credentials || null,
            secret_key: userData.secret_key || null,
          });
          setLoading(false)  
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
  
  // console.log('Datos del formulario a enviar:', formData);

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
      const data = await response.json();
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
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Register</h2>

          <Link to="/userReg">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              User Register
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              Credentials {loading ? (
                <div className="inline-block text-white h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
              ) : (
                completeCredent ? <FcOk className="text-xl" /> : <FcHighPriority className="text-xl" />
              )}
            </h1>
          </Link>

          <Link to="/notifications">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              PRO Account
            </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">

          <h2 className="flex text-black justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            DEVICE CREDENTIALS
          </h2>         

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-x-14" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="usernameCre"
                  className="block mb-2 text-sm font-bold text-black dark:text-black"
                >
                  Credential-ID
                </label>
                <input
                  onChange={handleInputChange}
                  name="credentials"
                  type="text"
                  id="usernameCre"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Username"
                  value={formData.credentials || ''}                 
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="passwordCre"
                  className="block mb-2 text-sm font-bold text-black dark:text-black"
                >
                  Secret-key
                </label>
                <input
                  onChange={handleInputChange}
                  name="secret_key"
                  type="password"
                  id="passwordCre"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Password"
                  value={formData.secret_key || ''} 
                  required
                />
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
