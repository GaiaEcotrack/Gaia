import { Link } from "react-router-dom";

// const [selectedFile, setSelectedFile] = useState<File | null>(null);

function UserRegister() {
  return (
    <div className=" w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-white">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Register</h2>

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
          <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4">
            USER ACCOUNT
          </h2>

          <div className="flex flex-col justify-start items-center space-y-5 sm:flex-row sm:space-y-0 max-w-2xl my-8">
            {/* Imagen del perfil */}
            <img
              className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
              src={
                localStorage.getItem("profilePic") ||
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="Bordered avatar"
            />

            {/* Botones para cambiar y eliminar la imagen */}
            <div className="flex flex-col space-y-5 sm:ml-8">
              <button
                type="button"
                className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200 "
              >
                Change Email
              </button>
              <button
                type="button"
                className="py-3.5 px-7 text-base font-medium text-black focus:outline-none bg-white rounded-lg border border-indigo-200 hover:bg-indigo-100 hover:text-[#202142] focus:z-10 focus:ring-4 focus:ring-indigo-200 "
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Formulario de perfil público */}

          <div className="">
            <form className="grid sm:grid-cols-2 gap-4" action="">
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Full name
                </label>
                <input
                  type="text"
                  id="fullname"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Name"
                  defaultValue={localStorage.getItem("name") || ""}
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="your.email@mail.com"
                  value={localStorage.getItem("email") || "name@email.com"}
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="Identification"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Identification Number
                </label>
                <input
                  type="number"
                  id="Identification"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Identification"
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Residence Address
                </label>
                <input
                  type="text"
                  id="Address"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Address"
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phone"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Phone"
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileId"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of your identity document
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileId"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileBank"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of your bank account status
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileBank"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="fileTax"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of your tax return
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="fileTax"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="filefin1"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file of other financial documents
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
                  id="filefin1"
                  className="bg-indigo-50 border border-indigo-300 text-black text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="filefin2"
                  className="block mb-2 text-sm font-medium text-indigo-50 dark:text-white"
                >
                  Upload a file ofother financial documents
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, application/pdf"
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

export { UserRegister };
