import { BsFillShieldLockFill } from "react-icons/bs"; 
import { FcSms } from "react-icons/fc"; 
import { useState } from "react";
import OtpInput from 'react-otp-input';
import axios from "axios";
import Swal from "sweetalert2";

interface MoodalSms {
  showSmsVerify: boolean;
  setShowSmsVerify(showSmsVerify: boolean): void;
  telephone: string
}

function SmsVerify(props:MoodalSms) {

  const URL = import.meta.env.VITE_APP_API_URL
  const { showSmsVerify, setShowSmsVerify, telephone } = props;
  const [otp, setOtp] = useState("");

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

  const formatPhone = "+" + telephone;
  const id = localStorage.getItem("id")
  
  const handleVerifyPhoneNumber = async () => {
    try {
      const response = await axios.post(`${URL}/sms/verify-otp`, {
        phone_number:  formatPhone,
        otp_code: otp,
        id: id
      });
      
      if (response.status === 200) {
        Toast.fire({
          icon: "success",
          title: "OTP successfully verified"
        }); 
      } else {
        Toast.fire({
          icon: "error",
          title: "Something went wrong"
        });
        console.error("Verification failed:", response.data.error);
      }
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "Something went wrong"
      });
      console.error("Error during verification:", error);
    }
  };
  
  return showSmsVerify ? (
    <div className="bg-[#00000054] fixed top-0 left-0 h-full w-full flex justify-center items-center text-white">
        
        <div className="flex flex-col justify-center items-center rounded-3xl bg-[#233e6f] h-[50%] xl:h-[32rem] w-full md:w-[50%] xl:w-[41rem] p-4 md:p-6 mt-40 md:mt-0">
          
        <div className="flex flex-row items-end" >

          <h1 className="text-xl md:text-2xl mb-6">
            Verify your cell phone number
          </h1>  
            <FcSms className="text-5xl ml-4 mb-6"/>         
        </div>

          <h1 className="font-normal text-2xl mb-6">
            Enter the code received by SMS in the number
          </h1>

          <div className="flex flex-col items-end ">
            <h1 className="font-normal text-2xl mb-6">
              + {telephone} 
            </h1>
          </div>

          <BsFillShieldLockFill className="text-6xl mb-8"/>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            containerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px', // Adjust the gap as needed
              marginBottom: '48px',
            }}
            inputStyle={{
              marginRight: '0',
              flex: '1',
              outline: 'none',
              color: 'black',
              fontWeight: 'bold',
              width: '35px',
              height: '35px',
              fontSize: '16px',
              borderRadius: '5px',
            }}
          />

          <button
            onClick={() => {setShowSmsVerify(false); handleVerifyPhoneNumber();}}
            className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded "
          >
            Verify OTP
          </button>

          <button
            type="button"
            onClick={() => {setShowSmsVerify(false)}}  
            className="bg-blue-500 hover:bg-[#ef4444db] w-[17%] flex gap-1 items-center justify-center py-1 text-lg text-white rounded mt-4"          
            >
            Cancel
          </button>
          
        </div>
      </div>
    ) : null
  }

  export { SmsVerify };