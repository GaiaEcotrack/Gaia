import axios from "axios";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import OtpInput from 'react-otp-input';
import Swal from "sweetalert2";

interface MoodalId {
  showGAuth: boolean;
  setShowGAuth(showGAuth: boolean): void;
}

function ModalGoogleAuth(props:MoodalId) {

  const URL = import.meta.env.VITE_APP_API_URL
  const { showGAuth, setShowGAuth } = props;
  const [qrImageBase64, setQrImageBase64] = useState<string | null>(null);
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

  useEffect(() => {
    if (showGAuth) {
      const fetchData = async () => {
        try {
          const email = localStorage.getItem('email');
          const id = localStorage.getItem('id');

          const response = await axios.post(`${URL}/auth/generate_key`, {
            email,
            id,
          });

          const { qr_image: qrImageBase64FromServer } = response.data.user;

          setQrImageBase64(qrImageBase64FromServer);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [showGAuth]);

  const handleVerifyOTP = async () => {
    try {
      const id = localStorage.getItem('id');

      const response = await axios.post(`${URL}/auth/verify_otp`, {
        id,
        otp,
      });

      console.log(response.data.message)

      Toast.fire({
        icon: "success",
        title: `${response.data.message}`
      });
      setShowGAuth(false)

    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      Toast.fire({
        icon: "error",
        title: "wrong code"
      });
    }
  };

    return showGAuth ? (
      <div className="bg-[#0000003d] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-center items-center bg-white h-[100%] 2xl:h-[85%] w-[60%] 2xl:w-[60%] p-4 md:p-6 mt-40 md:mt-0">
        
          <h1 className="text-[#000000] text-xl md:text-2xl md:mb-6">
            Bind your account
          </h1>

          <h1 className="flex justify-center items-center font-normal md:justify-start mb-4">
            Enter&nbsp;
            <FcGoogle className="flex items-center text-xl mb-1"/>
            oogle Authenticator and scan the QR code
          </h1>

          {qrImageBase64 && (
            <img
              src={`data:image/png;base64,${qrImageBase64}`}
              alt="QR Code"
              className="max-w-[25%] my-4 border-4 border-black"
            />
          )}

          <h1 className="mt-8 ">
            Enter the OTP code
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
              marginTop: '30px'
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
            className="bg-emerald-600 w-[40%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded mt-8">
            Verify OTP
          </button>

          <button
          type="button"
          onClick={() => {setShowGAuth(false)}}  
          className="bg-red-600 w-[20%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded mt-8"          
          >
          Cancel
          </button>
            
        </div>
      </div>
    ) : null
  } 

  export { ModalGoogleAuth };