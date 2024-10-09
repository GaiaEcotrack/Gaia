import { useAccount, useAlert } from "@gear-js/react-hooks";
import axios from "axios";
import React from "react";

const CardGenerated = ({ total , moment }: any) => {

  const alert = useAlert()
  const {account} = useAccount()
  const username=import.meta.env.VITE_APP_ADMIN_USER
  const password=import.meta.env.VITE_APP_ADMIN_PASSWORD
  const apiExpress = import.meta.env.VITE_APP_API_EXPRESS
  const userId = localStorage.getItem('id');

  const createGenerator = async () => {
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
          name: "userTest",
          wallet: account?.address,
          secret_name: "Monitoreo_2",
          installation_company:"Fibra_Andina",
          brand:"Hoymiles" 
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

  const putUser= async ()=>{
    try {
      await axios.put(`${apiExpress}/users`,{
        userId:userId,
        property:"username",
        value:"Monitoreo_2"
      })
    } catch (error) {
      console.log(error);
      
    }
  }

  const putUserBrand= async ()=>{
    try {
      await axios.put(`${apiExpress}/users`,{
        userId:userId,
        property:"device_brand",
        value:"Hoymiles"
      })
    } catch (error) {
      console.log(error);
      
    }
  }


  const handleSubmit = async ()=>{
    try {
      await createGenerator()
      await putUser()
      await putUserBrand()
      alert.success('Devices added')
      window.location.reload();

    } catch (error) {
      console.log(error);
      
    }
  }


  console.log(userId);
  
  return (
    <div>
      <div className="relative grid h-[35rem] sm:h-[50rem] w-full max-w-[28rem] flex-col items-end justify-center overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
        <div className="absolute inset-0 m-0 h-full w-full overflow-hidden rounded-none bg-transparent bg-[url('/fondothree.jpg')] bg-cover bg-clip-border bg-center text-gray-700 shadow-none">
          <div className="absolute inset-0 w-full h-full to-bg-black-10 bg-gradient-to-t from-black/80 via-black/50"></div>
        </div>
        <div className="relative mb-32 flex items-center justify-center flex-col gap-5  md:px-12">
          <h2 className="mb-6 block font-sans text-4xl font-medium leading-[1.5] tracking-normal text-white antialiased">
            Renewable energy transforming the world, taking care of our planet
          </h2>
          <div>
            <div className="flex gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#ffffff"}
                fill={"none"}
              >
                <path
                  d="M12.5 2L10 6H14L11.5 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 6C17.9428 6 18.4142 6 18.7071 6.29289C19 6.58579 19 7.05719 19 8V10.5M7 6C6.05719 6 5.58579 6 5.29289 6.29289C5 6.58579 5 7.05719 5 8L5 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 13H18C17.0572 13 16.5858 13 16.2929 13.2929C16 13.5858 16 14.0572 16 15V20C16 20.9428 16 21.4142 16.2929 21.7071C16.5858 22 17.0572 22 18 22H20C20.9428 22 21.4142 22 21.7071 21.7071C22 21.4142 22 20.9428 22 20V15C22 14.0572 22 13.5858 21.7071 13.2929C21.4142 13 20.9428 13 20 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 19H22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 16L22 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 13H4C3.05719 13 2.58579 13 2.29289 13.2929C2 13.5858 2 14.0572 2 15V20C2 20.9428 2 21.4142 2.29289 21.7071C2.58579 22 3.05719 22 4 22H6C6.94281 22 7.41421 22 7.70711 21.7071C8 21.4142 8 20.9428 8 20V15C8 14.0572 8 13.5858 7.70711 13.2929C7.41421 13 6.94281 13 6 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 19H8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 16L8 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h5 className="block mb-4 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-white">
                Total Generated
              </h5>
            </div>
            <h5 className="block mb-4 font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-white">
              {total} K/w
            </h5>
          </div>
          <div>
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                color={"#ffffff"}
                fill={"none"}
              >
                <path
                  d="M6.19351 11.3965L12.192 3.31186C12.6611 2.67957 13.5405 3.07311 13.5405 3.91536V10.1729C13.5405 10.6775 13.8853 11.0865 14.3107 11.0865H17.2283C17.891 11.0865 18.2443 12.0134 17.8065 12.6035L11.808 20.6881C11.3389 21.3204 10.4595 20.9269 10.4595 20.0846V13.8271C10.4595 13.3225 10.1147 12.9135 9.68931 12.9135H6.77173C6.10895 12.9135 5.75566 11.9866 6.19351 11.3965Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h5 className="block mb-4 font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-white">
                Generating
              </h5>
            </div>

            <h5 className="block mb-4 font-sans text-3xl antialiased font-semibold leading-snug tracking-normal text-white">
              {moment} W
            </h5>
          </div>
          <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Connect to a test device
              </button>

          <img
            alt="Logo"
            src="/LogoGaia.svg"
            className="relative inline-block h-[74px] w-[74px] !rounded-full border-2 border-white object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default CardGenerated;
