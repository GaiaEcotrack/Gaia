import { FcOk } from "react-icons/fc"; 
import { FcHighPriority } from "react-icons/fc"; 
import { FcFeedback } from "react-icons/fc"; 
import { FcGoogle } from "react-icons/fc"; 
import { FcSms } from "react-icons/fc"; 
import { FcPhoneAndroid } from "react-icons/fc"; 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ModalGoogleAuth } from "./Modal_GoogleAuth";
import { SmsSendVerify } from "./Modal_smsSendVerify";
import { EmailVerify } from "./Modal_emailVerify";
import axios from "axios";
import { getAuth } from "firebase/auth";

function SecurityVerify() {

  const URL = import.meta.env.VITE_APP_API_URL
  const [showGAuth, setShowGAuth] = useState(false)
  const [showSmsSendVerify, setShowSmsSendVerify] = useState(false)
  const [showEmailVerify, setShowEmailVerify] = useState(false)
  const [verified_2fa, setVerified_2fa] = useState('')
  const [verified_email, setVerified_email] = useState('')
  const [verified_sms, setVerified_sms] = useState('')
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const handleSearch = async () => {
      try {        
        if(user && user.emailVerified){
          const userId = localStorage.getItem('id')
          await axios.put(`${URL}/users/${userId}`, {
            verified_email: true  
          }); 
        } 
        const email = localStorage.getItem("email");        
        const response = await axios.get(`${URL}/users/search`, {
          params: {
            email: email,
          },
        });
        if (response.status === 200) {
          setVerified_2fa(response.data.verified_2fa);
          setVerified_email(response.data.verified_email);
          setVerified_sms(response.data.verified_sms);
        } 
        setLoading(false) 
      } catch (error) {
        console.log("Error de red: ", error ) 
      }
    };
    handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" w-full bg-white flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-black">
      {/* Aside */}
      <aside className="hidden py-4 md:w-1/3 lg:w-1/4 md:block">
        <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-indigo-100 top-12">
          <h2 className="pl-3 mb-4 text-2xl font-semibold">Profile</h2>

          <Link to="/userReg">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              User Account
            </h1>
          </Link>

          <Link to="/credentialsReg">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Credentials
            </h1>
          </Link>

          <Link to="/idVerification">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Identification
            </h1>
          </Link>

          <Link to="/security">
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              Security Settings
            </h1>
          </Link>

          <Link to="/deviceReg">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Device Register
            </h1>
          </Link>


          <Link to="/notifications">
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex items-cente px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              PRO Account
            </h1>
          {/* </Link> */}
        </div>
      </aside>

      {/* Main */}
      <main className="flex justify-start items-start min-h-screen py-1 w-[100%] p-2 md:p-4">
        <div className="px-6 pb-8 mt-8 sm:rounded-lg w-full">

          <h2 className="flex justify-cente md:justify-start text-2xl font-bold sm:text-xl pt-4 mb-8">
            SECURITY VERIFICATION
          </h2>

          <div className="flex justify-center items-center p-6 px-8 mb-8 border rounded-lg bg-indigo-50 border-indigo-300 ">
            <FcPhoneAndroid className="text-7xl w-[20%] "/> 
            
            <div className="flex flex-col justify-start items-start font-normal md:justify-start text-2xl sm:text-xl mx-8 w-[60%]">
              <h1 className="flex justify-center items-center font-bold md:justify-start text-2xl sm:text-xl">
              <FcGoogle className="flex items-center text-2xl mb-1"/>
                oogle Authenticator
              </h1> 
              <h1 className="font-normal text-sm text-[#000000b1]">
                TOTP is used as a security check when you log in, make transactions, or change security settings.
              </h1>
            </div>

            <div>
            {loading ? (
                <div className="inline-block text-black h-7 w-7 mr-7 ml-1 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
              ) : (
                verified_2fa ? <FcOk className="text-4xl mr-6" /> : <FcHighPriority className="text-4xl mr-6" />
              )}
            </div>

            <button onClick={() => {setShowGAuth(true)}} className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-[20%]">
              Bind
            </button>
          </div>

          <div className="flex justify-center items-center p-6 px-8 mb-8 border rounded-lg bg-indigo-50 border-indigo-300 ">
            <FcFeedback className="text-7xl w-[20%] "/> 

            <div className="flex flex-col justify-start items-start font-normal md:justify-start text-2xl sm:text-xl mx-8 w-[60%]">
              <h1 className="flex justify-center items-center font-bold md:justify-start text-2xl sm:text-xl">
                Email Verification
              </h1> 
              <h1 className="font-normal text-sm text-[#000000b1]">
                Please enter your email correctly
              </h1>
            </div>

            <div>
            {loading ? (
                <div className="inline-block text-black h-7 w-7 mr-7 ml-1 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
              ) : (
                verified_email ? <FcOk className="text-4xl mr-6" /> : <FcHighPriority className="text-4xl mr-6" />
              )}
            </div>

            <button onClick={() => {setShowEmailVerify(true)}} className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-[20%]">
              Verify Now
            </button>
          </div>

          <div className="flex justify-center items-center p-6 px-8 mb-8 border rounded-lg bg-indigo-50 border-indigo-300 ">
            <FcSms className="text-7xl w-[20%] "/> 

            <div className="flex flex-col justify-start items-start font-normal md:justify-start text-2xl sm:text-xl mx-8 w-[60%]">
              <h1 className="flex justify-center items-center font-bold md:justify-start text-2xl sm:text-xl">
                SMS Verification
              </h1> 
              <h1 className="font-normal text-sm text-[#000000b1]">
                For your security
              </h1>
            </div>

            <div>
            {loading ? (
                <div className="inline-block text-black h-7 w-7 mr-7 ml-1 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status"></div>
              ) : (
                verified_sms ? <FcOk className="text-4xl mr-6" /> : <FcHighPriority className="text-4xl mr-6" />
              )}
            </div>

            <button onClick={() => {setShowSmsSendVerify(true)}} className="text-white bg-[#2f5190] hover:bg-[#5173b2] focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-[20%]">
              Verify Now
            </button>

          </div>

        </div>
      </main>

      <ModalGoogleAuth showGAuth={showGAuth} setShowGAuth={setShowGAuth}/>
      <SmsSendVerify showSmsSendVerify={showSmsSendVerify} setShowSmsSendVerify={setShowSmsSendVerify} telephone={telephone}/>
      <EmailVerify showEmailVerify={showEmailVerify} setShowEmailVerify={setShowEmailVerify}/>
    </div>
  );
}

const telephone = "" 

export { SecurityVerify };
