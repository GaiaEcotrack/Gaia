import { FcSms } from "react-icons/fc"; 
import { useState } from "react";
import OtpInput from 'react-otp-input';
import axios from "axios";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";

interface MoodalSms {
  showSmsSendVerify: boolean;
  setShowSmsSendVerify(showSmsSendVerify: boolean): void;
  telephone: string;
}

function SmsSendVerify(props:MoodalSms) {

  const URL = import.meta.env.VITE_APP_API_URL
  const { showSmsSendVerify, setShowSmsSendVerify } = props;
  const [otp, setOtp] = useState("");
  const [cellPhone, setCellPhone] = useState("");

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

  const [formData, setFormData] = useState({
    phone: cellPhone || null
  });

  const handlePhoneChange = (formattedValue: string) => {
    setCellPhone(formattedValue); // Actualiza el estado de cellPhone
    setFormData({
      ...formData,
      phone: formattedValue, // Actualiza el estado de formData.phone
    });
  };
  const handleSms = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const formatPhone = "+" + cellPhone;

    try {
      const response = await axios.post(`${URL}/sms/send-otp`, {
        phone_number: formatPhone,
      });

      if (response.data.success) {
        Toast.fire({
          icon: "success",
          title: "SMS sent successfully"
        }); 
        setShowSmsSendVerify(true)
      } else {
        console.error('Error sending OTP');
      }
    } catch (error) {
      console.error('Network or server error:', error);
    }
  };

  const formatPhone = "+" + cellPhone;
  const id = localStorage.getItem("id")
  
  const handleVerifyPhoneNumber = async () => {
    try {
      const response = await axios.post(`${URL}/sms/verify-otp`, {
        phone_number: formatPhone,
        otp_code: otp,
        id: id
      });
      
      if (response.status === 200) {
        const userId = localStorage.getItem('id'); // Obtener el ID del localStorage
        await axios.put(`${URL}/users/${userId}`, {
          phone: cellPhone  // Reemplaza 'formatPhone' con el nuevo número de teléfono
        });

        Toast.fire({
          icon: "success",
          title: "OTP verified successfully"
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
  
  return showSmsSendVerify ? (
    <div className="bg-[#00000054] fixed top-0 left-0 h-full w-full flex justify-center items-center text-white">
        
        <div className="flex flex-col justify-center items-center rounded-3xl bg-[#233e6f] h-[50%] xl:h-[32rem] w-full md:w-[50%] xl:w-[41rem] p-4 md:p-6 mt-40 md:mt-0">
          
        <div className="flex flex-row items-end" >

          <h1 className="text-xl md:text-2xl mb-6">
            Confirm your cell phone number
          </h1>  
            <FcSms className="text-5xl ml-4 mb-6"/>         
        </div>

          <div className="text-black mb-6">
            <PhoneInput
              onChange={handlePhoneChange}
              country={"co"}
              value={formData.phone}
              inputStyle={{
                background: '#eef2ff',
                border: '1px solid #a5b4fc',
                color: '#000000',
                fontSize: '0.875rem',
                borderRadius: '8px',
                outline: 'none',
                width: '100%',
                height: '47px',
              }}
            />
          </div>   

          <button
            onClick={handleSms}
            className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded mb-12"
          >
            Step 1. Send SMS
          </button>       

          <h1 className="font- text-2xl mb-6">
            Enter the code received by SMS in the number
          </h1>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            containerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px', // Adjust the gap as needed
              marginBottom: '24px',
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
            onClick={() => {setShowSmsSendVerify(false); handleVerifyPhoneNumber();}}
            className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded "
          >
            Step 2. Verify OTP
          </button>

          <button
            type="button"
            onClick={() => {setShowSmsSendVerify(false)}}  
            className="bg-blue-500 hover:bg-[#ef4444db] w-[17%] flex gap-1 items-center justify-center py-1 text-lg text-white rounded mt-4"          
            >
            Cancel
          </button>
          
        </div>
      </div>
    ) : null
  }

  export { SmsSendVerify };