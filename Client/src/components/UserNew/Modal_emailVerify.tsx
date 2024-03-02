import { MdOutlineMarkEmailUnread } from "react-icons/md"; 
import { FcFeedback, FcSms } from "react-icons/fc"; 
import { useState } from "react";
import OtpInput from 'react-otp-input';
import axios from "axios";
import Swal from "sweetalert2";
import PhoneInput from "react-phone-input-2";

interface MoodalSms {
  showEmailVerify: boolean;
  setShowEmailVerify(showEmailVerify: boolean): void;
}

function EmailVerify(props:MoodalSms) {

  const URL = import.meta.env.VITE_APP_API_URL
  const { showEmailVerify, setShowEmailVerify } = props;
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
        setShowEmailVerify(true)
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
  
  return showEmailVerify ? (
    <div className="bg-[#00000054] fixed top-0 left-0 h-full w-full flex justify-center items-center text-white">
        
        <div className="flex flex-col justify-center items-center rounded-3xl bg-[#233e6f] h-[50%] xl:h-[27rem] w-full md:w-[50%] xl:w-[41rem] p-4 md:p-6 mt-40 md:mt-0">
          
        <div className="flex flex-row items-end mb-12" >
          <h1 className="text-xl md:text-2xl">
            Confirm your Email and send
          </h1>   
            <MdOutlineMarkEmailUnread className="text-5xl ml-4"/>           
        </div>

          <div className="flex justify-center gap-6 text-black mb-10 w-full">
            <input
              // onChange={handleInputChange}
              name="address"
              type="text"
              id="Address"
              className="bg-indigo-50 border text-center outline-none border-indigo-300 text-black rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block h-10 w-72 p-2.5"
              placeholder="Email"
              // value={formData.address || ''}
              required
            />

            <button
              // onClick={handleSms}
              className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] h-10 flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded"
              >
              Send
            </button> 

          </div> 

          <div>
            <h1 className="text-center font-normal text-2xl mb-10">
             Before ¡Ok!, go to your email account, check your inbox or spam and follow the instructions to verify. Then come back and ¡Ok!
            </h1>
          </div>

          <button
            onClick={() => {setShowEmailVerify(false)}}
            className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded mb-4"
          >
            ¡Ok!
          </button>
          
        </div>
      </div>
    ) : null
  }

  export { EmailVerify };