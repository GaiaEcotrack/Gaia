import { Link } from "react-router-dom";

// const [selectedFile, setSelectedFile] = useState<File | null>(null);

function Notifications() {
  return (
    <div className=" w-full bg-white flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black">
      {/* Aside */}
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

          <Link to="/notifications">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
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

          <h2 className="flex text-black justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4">
            NOTIFICATIONS
          </h2>

          <div className="bg-[#142545] text-xs md:text-base w-[95%] rounded-lg flex flex-col justify-start items-center px-2 py-4 mt-14">
              
              <div className="flex justify-between w-full space-y-4 items-center text-white lg:gap-40 2xl:gap-60 border-b-2 border-slate-300 px-2 mdpx-4 h-10 md:h-12">
                <p className="ml-[0.2vh] md:ml-0 w-42">Receive notifications for transactions</p>
                <div>
                  <label className="relative inline-flex mt-[-2vh] md:ml-0 ml-8 items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-gray-400 mt-[0.6vh] rounded-full outline-none duration-300 after:duration-300   h-6 w-12   md:h-8 md:w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none    after:h-6 after:w-6   md:after:h-8 md:after:w-8 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between w-full space-y-4 items-center text-white lg:gap-40 2xl:gap-60 border-b-2 border-slate-300 px-2 mdpx-4 h-10 md:h-12">
                <p className="ml-[0.2vh] md:ml-0 w-42">Receive notifications about account updates</p>
                <div>
                  <label className="relative inline-flex mt-[-2vh] md:ml-0 ml-8 items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-gray-400 mt-[0.6vh] rounded-full outline-none duration-300 after:duration-300   h-6 w-12   md:h-8 md:w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none    after:h-6 after:w-6   md:after:h-8 md:after:w-8 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between w-full space-y-4 items-center text-white lg:gap-40 2xl:gap-60 border-b-2 border-slate-300 px-2 mdpx-4 h-10 md:h-12">
                <p className="ml-[0.2vh] md:ml-0 w-42">Receive notifications about news</p>
                <div>
                  <label className="relative inline-flex mt-[-2vh] md:ml-0 ml-8 items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-gray-400 mt-[0.6vh] rounded-full outline-none duration-300 after:duration-300   h-6 w-12   md:h-8 md:w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none    after:h-6 after:w-6   md:after:h-8 md:after:w-8 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between w-full space-y-4 items-center text-white lg:gap-40 2xl:gap-60 border-b-2 border-slate-300 px-2 mdpx-4 h-10 md:h-12">
                <p className="ml-[0.2vh] md:ml-0 w-42">Receive alerts when energy production is optimal</p>
                <div>
                  <label className="relative inline-flex mt-[-2vh] md:ml-0 ml-8 items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" />
                    <div className="group peer ring-0 bg-gray-400 mt-[0.6vh] rounded-full outline-none duration-300 after:duration-300   h-6 w-12   md:h-8 md:w-14 shadow-md peer-checked:bg-emerald-500  peer-focus:outline-none  after:content-['✖️'] after:rounded-full after:absolute after:bg-gray-50 after:outline-none    after:h-6 after:w-6   md:after:h-8 md:after:w-8 after:flex after:justify-center after:items-center peer-checked:after:translate-x-6 peer-checked:after:content-['✔️'] peer-hover:after:scale-95"> </div>
                  </label>
                </div>
              </div>
        
              
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

export { Notifications };
