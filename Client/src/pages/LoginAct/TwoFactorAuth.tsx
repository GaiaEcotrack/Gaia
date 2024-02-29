import axios from "axios";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import OtpInput from 'react-otp-input';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface MoodalId {
  showTwoFA: boolean;
  setShowTwoFA(showTwoFA: boolean): void;
  foundUserId: string
}

function TwoFactorAuth(props:MoodalId) {

  const URL = import.meta.env.VITE_APP_API_URL
  const { showTwoFA, setShowTwoFA, foundUserId } = props;
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

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

  const handleVerifyOTP = async () => {
    try {
      const id = foundUserId

      const response = await axios.post(`${URL}/auth/verify_otp`, {
        id,
        otp,
      });

      console.log(response.data.message)
      Toast.fire({
        icon: "success",
        title: `${response.data.message}`
      });
      setShowTwoFA(false)
      navigate('/home');

    } catch (error) {
      console.error('Error verifying OTP:', error);
      Toast.fire({
        icon: "error",
        title: "wrong code"
      });
    }
  };

    return showTwoFA ? (
      <div className="bg-[#00000054] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-center items-center text-black rounded-3xl bg-[#ffffff] h-[50%] 2xl:h-[45%] w-[36%] 2xl:w-[36%] p-6 mt-40 md:mt-0 ">
        
          <h1 className="text-3xl mb-4">
            Two Factor Authentication
          </h1>

          <h1 className="flex justify-center w-full font-normal">
            Enter the generated code in&nbsp;
            <FcGoogle className="flex items-center text-xl mb-4"/>
            oogle Authenticator
          </h1>

          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => <input {...props} />}
            containerStyle={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              marginTop: '10px'
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
              border: '1px solid black'
            }}
          />

          <button
            onClick={handleVerifyOTP}
            className="bg-[#1d4ed8] hover:bg-[#51c355] w-[40%] flex gap-1 items-center justify-center py-2 text-lg text-white  mt-8">
            Verify OTP
          </button>

          <button
          type="button"
          onClick={() => {setShowTwoFA(false)}}  
          className="bg-[#1d4ed8] hover:bg-[#e54646df] w-[20%] flex gap-1 items-center justify-center py-1 text-lg text-white mt-4"          
          >
          Cancel
          </button>
            
        </div>
      </div>
    ) : null
  } 

  export { TwoFactorAuth };