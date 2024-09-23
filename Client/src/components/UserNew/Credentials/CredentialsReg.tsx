
import axios from "axios";
import { useEffect, useState } from "react";
import { FcHighPriority, FcOk } from "react-icons/fc";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import { useAccount } from "@gear-js/react-hooks";

function CredentialsReg () {
  const auth = getAuth()
  const {account} = useAccount()

  const userLogin =auth.currentUser?.displayName

  const [email, setEmail] = useState('');
  const [foundUserId, setFoundUserId] = useState('');
  const [completeCredent, setCompletedCredent] = useState(false);
  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_APP_API_URL
  const username=import.meta.env.VITE_APP_ADMIN_USER
  const password=import.meta.env.VITE_APP_ADMIN_PASSWORD
  const apiExpress = import.meta.env.VITE_APP_API_EXPRESS

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const createGenerator = async (secret, company) => {
    try {
      // Realiza el login y obtiene el token
      const loginResponse = await axios.post(`${apiExpress}/auth/login`, {
        username: username, 
        password: password  
      });
      
      const token = loginResponse.data.token;
  
      // Almacena el token en el localStorage
      localStorage.setItem('token', token);
  
      // Realiza el post a /generator/users usando el token en los headers
      await axios.post(
        `${apiExpress}/generator/users`,
        { 
          name: userLogin,
          wallet: account?.address,
          secret_name: secret,
          installation_company: company 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  

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
    device_brand: null,
    username: null,
    installation_company: null,
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
            device_brand: userData.device_brand || null,
            username: userData.username || null,
            installation_company: userData.installation_company || null,
          });
          setLoading(false)  
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foundUserId]);


// **********************************************************

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    createGenerator(formData.username,formData.installation_company)

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
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Profile</h2>

          <Link to="/userReg">
            <h1 className="flex text-black items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              User Account
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

          <Link to="/idVerification">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Identification
            </h1>
          </Link>

          <Link to="/security">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Security Settings
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>

          {/* <Link to="/IamInstaller">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              I am Installer
            </h1>
          </Link>
          
          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link> */}

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
            <form className="grid sm:grid-cols-2 gap-x-14" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="device_brand"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Device Brand
                </label>
                <select
                  onChange={handleInputChange}
                  name="device_brand"
                  id="device_brand"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  value={formData.device_brand || ''}
                  required
                >
                  <option value="" disabled>Select Device Brand</option>
                  <option value="Hoymiles">Hoymiles</option>
                  <option value="Solis">Solis</option>
                  <option value="SMA">SMA</option>
                  <option value="Growatt">Growatt</option>
                </select>
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Secret-key
                </label>
                <input
                  onChange={handleInputChange}
                  name="username"
                  type="text"
                  id="username"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Username"
                  value={formData.username || ''} 
                  required
                />
              </div>  

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
                  <option value="Sachar">Sachar S.A.S</option>
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

export { CredentialsReg };
