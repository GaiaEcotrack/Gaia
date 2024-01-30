import { Link } from "react-router-dom";

// const [selectedFile, setSelectedFile] = useState<File | null>(null);

function DeviceRegister() {
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
            <h1 className="flex items-center px-3 py-2.5 font-bold bg-white text-black border rounded-full">
              Device Register
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-white hover:border hover:rounded-full">
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
            NEW DEVICE
          </h2>

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-4" action="">
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceId"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Device Id 
                </label>
                <input
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
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Device Name - Type
                </label>
                <input
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
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Serial Number
                </label>
                <input
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
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload an image of the device
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  id="filefin2"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
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

export { DeviceRegister };
