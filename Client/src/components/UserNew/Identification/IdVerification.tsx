import { FcSelfie } from "react-icons/fc"; 
import { useState } from "react";
import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
import { ModalIdVerify } from "./Modal_idVerify";

function IdVerification() {

  const [showIdVerify, setShowIdVerify] = useState(false)


  return (
    <div className=" w-full bg-white flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Profile</h2>

          <Link to="/userReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
            User Account
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Credentials
            </h1>
          </Link>

          <Link to="/idVerification">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
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

          <Link to="/IamInstaller">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              I am Installer
            </h1>
          </Link>
          
          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">

          <h2 className="flex justify-center md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            IDENTITY VERIFICATION
          </h2>

          <div className="flex justify-center items-center p-6 px-8 mb-8 border rounded-lg bg-indigo-50 border-indigo-300 ">
            <FcSelfie className="text-9xl w-[20%] "/> 

            <h1 className="flex justify-center items-center font-normal md:justify-start text-2xl sm:text-xl mx-8 w-[60%]">
              Requirements: Basic information, identification document, facial recognition.
            </h1> 

            <button onClick={() => {setShowIdVerify(true)}} className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-[20%] mt-4">
              Verify Now
            </button>
          </div>

        </div>
      </main>

      <ModalIdVerify showIdVerify={showIdVerify} setShowIdVerify={setShowIdVerify}/>
    </div>
  );
}

export { IdVerification };
