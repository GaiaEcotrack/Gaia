import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAccount, useApi, useAlert } from "@gear-js/react-hooks";
import { web3FromSource } from "@polkadot/extension-dapp";
import { ProgramMetadata, decodeAddress, GearKeyring } from "@gear-js/api";
import { Button } from "@gear-js/ui";

function DeviceRegister() {



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

  const URL = import.meta.env.VITE_APP_API_URL

  const [formData, setFormData] = useState({
    user_id: localStorage.getItem("id"),
    plant: {
        plantId: "",
        plantName: "",
        plantTimezone: "",
        description: ""
    },
    device: {
        deviceId: "",
        deviceName: "",
        deviceTimezone: "",
				serial: "",
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
  



  
//VARA////////
const alert = useAlert();
const { accounts, account } = useAccount();
const { api } = useApi();
const programIDFT = "0x633d0f014702f15973932d129e12f5c144124de630125239c764694a143c6a28"


// Add your metadata.txt
const meta = "000200010000000000010400000001090000000000000000010a0000005d0e3c000808696f18496e69744654000004013466745f70726f6772616d5f696404011c4163746f72496400000410106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004000801205b75383b2033325d000008000003200000000c000c0000050300100808696f48416374696f6e4761696145636f747261636b000114304e657747656e657261746f72080004011c4163746f724964000014012447656e657261746f720000003847656e6572617465456e6572677904001801107531323800010028476574526577617264730400180110753132380002002c5472616e736665727265640c0004011c4163746f724964000004011c4163746f724964000018011075313238000300244e657744657669636508001c0118537472696e67000020012c44657669636573496e666f00040000140808696f2447656e657261746f72000014010869641801107531323800011877616c6c657404011c4163746f72496400013c746f74616c5f67656e65726174656418011075313238000138617665726167655f656e657267791801107531323800011c726577617264731801107531323800001800000507001c0000050200200808696f2c44657669636573496e666f00001001086964180110753132380001106e616d651c0118537472696e6700012c747970655f656e657267791c0118537472696e6700011873657269616c1c0118537472696e670000240808696f484576656e74734761696145636f747261636b00011428526567697374657265640000002447656e657261746564000100405265776172647347656e65726174656400020044546f6b656e735472616e736665727265640c011066726f6d04011c4163746f724964000108746f04011c4163746f724964000118616d6f756e741801107531323800030038446576696365526567697374657204001c0118537472696e6700040000280808696f38496f4761696145636f747261636b0000140158746f74616c5f656e657267795f67656e6572617465641801107531323800012c746f74616c5f757365727318011075313238000140746f74616c5f67656e657261746f72731801107531323800012867656e657261746f72732c01645665633c284163746f7249642c2047656e657261746f72293e00011c646576696365733401685665633c28537472696e672c2044657669636573496e666f293e00002c0000023000300000040804140034000002380038000004081c2000"
const metadata = ProgramMetadata.from(meta);

const message: any = {
  destination: programIDFT, // programId
  payload: { newDevice:[formData.user_id,{"id":formData.device.deviceId, "name":formData.device.deviceName, "typeEnergy":formData.device.deviceName,"serial":formData.device.serial},]},
  gasLimit: 9999819245,
  value: 0,
};


async function signerTwo(){
  const localaccount = account?.address;
  const isVisibleAccount = accounts?.some(
    (visibleAccount) => visibleAccount.address === localaccount
  );

  if (isVisibleAccount && api) {
    // Create a message extrinsic
    const transferExtrinsic = await api.message.send(message, metadata);

    const injector = await web3FromSource(accounts?.[0]?.meta.source || 'unknown');

    transferExtrinsic
      .signAndSend(
        account?.address ?? alert.error("No account"),
        { signer: injector.signer },
        ({ status }: { status: any }) => {
          if (status.isInBlock) {
            alert.success(status.asInBlock.toString());
          } else {
              alert.info("In process")
            if (status.type === "Finalized") {
              alert.success(status.type);
            }
          }
        }
      )
      .catch((error: any) => {
        console.log(error);
        
      });
  } else {
    alert.error("Account not available to sign");
  }
};






  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // console.log('Datos del formulario a enviar:', formData);
  
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
        Toast.fire({
          icon: "success",
          title: "Device added successfully"
        });
        signerTwo()
  
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
      console.error('Error de red:', error);
    }
  };

  


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
            <h1 className="flex text-white items-center justify-between px-3 py-2.5 font-bold bg-[#212056] border rounded-full">
              Device Register
            </h1>
          </Link>


          <Link to="/notifications">
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
              Notifications
            </h1>
          </Link>

          {/* <Link to="/account"> */}
            <h1 className="flex items-center px-3 py-2.5 font-semibold hover:text-black hover:border hover:rounded-full">
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
            <form className="grid sm:grid-cols-2 gap-x-14" action="" onSubmit={handleSubmit}>
              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceId"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Device Id 
                </label>
                <input
                  onChange={handleInputChange}
                  name="deviceId"
                  type="number"
                  id="deviceId"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Device Id"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="deviceName"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Device Name - Type
                </label>
                <input
                  onChange={handleInputChange}
                  name="deviceName"
                  type="text"
                  id="deviceName"
                  className="bg-indigo-50 border outline-none border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Device Name"                  
                  required
                />
              </div>

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="serialNumber"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Serial Number
                </label>
                <input
                  onChange={handleInputChange}
                  name="serial"
                  type="text"
                  id="serialNumber"
                  className="bg-indigo-50 border outline-none border-indigo-300  text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  placeholder="Serial Number"
                  required
                />
              </div>             

              <div className="mb-2 sm:mb-6">
                <label
                  htmlFor="filefin2"
                  className="block mb-2 text-sm font-bold dark:text-black"
                >
                  Upload an image of the device
                </label>
                <input
                  onChange={handleInputChange}
                  name="image"
                  type="file"
                  accept="image/jpeg, image/png"
                  id="filefin2"
                  className="bg-indigo-50 border border-indigo-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"                  
                  // required
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

    </div>
  );
}

export { DeviceRegister };
