import { useState } from "react";
import { Link } from "react-router-dom";

// const [selectedFile, setSelectedFile] = useState<File | null>(null);

function DeviceRegister() {

  const URL = import.meta.env.VITE_APP_API_URL

  const [formData, setFormData] = useState({
    user_id: localStorage.getItem("id"),
    plant: {
        plantId: "",
        name: "",
        description: "",
        timezone: ""
    },
    device: {
        deviceId: "",
        name: "",
				serial: "",
        timezone: "",
        image: ""
    },
    sets: [""],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      device: {
        ...prevFormData.device,
        [name]: value,
      },
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log('Datos del formulario a enviar:', formData);
  
    try {
      const userId = localStorage.getItem('id');
  
      let apiUrl = `${URL}/devices/`;
      let httpMethod = 'POST';
  
      const response = await fetch(apiUrl, {
        method: httpMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('dispositivo agregado con éxito:', data);
  
        if (!userId) {
          console.log("Error")
        }
      } else {
        console.error('Error al agregar/actualizar dispositivo:', response.statusText);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };


  return (
    <div className=" w-full bg-white flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Register</h2>

          <Link to="/userReg">
            <h1 className="flex items-center text-black px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              User Register
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-center text-black px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Credentials
            </h1>
          </Link>

          <Link to="/notifications">
            <h1 className="flex items-center text-black px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex items-center text-black px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              PRO Account
            </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">

          <h2 className="flex justify-center text-black md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            NEW DEVICE
          </h2>

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-4" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceId"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  Device Id 
                </label>
                <input
                  onChange={handleInputChange}
                  name="deviceId"
                  type="number"
                  id="deviceId"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Device Id"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceName"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  Device Name - Type
                </label>
                <input
                  onChange={handleInputChange}
                  name="name"
                  type="text"
                  id="deviceName"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Device Name"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="serialNumber"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  Serial Number
                </label>
                <input
                  onChange={handleInputChange}
                  name="serial"
                  type="text"
                  id="serialNumber"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Serial Number"
                  required
                />
              </div>             

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="filefin2"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  Upload an image of the device
                </label>
                <input
                  onChange={handleInputChange}
                  name="image"
                  type="file"
                  accept="image/jpeg, image/png"
                  id="filefin2"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
                />
              </div>

              <div className="flex justify-start w-full">
                <button
                  type="submit"
                  className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-28"
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

export { DeviceRegister };
