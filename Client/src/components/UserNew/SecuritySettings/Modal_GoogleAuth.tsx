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
  const [keyAuthUser, setKeyAuthUser] = useState<string | null>(null);
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
          const { key_auth: keyAuthFromServer } = response.data.user;

          setQrImageBase64(qrImageBase64FromServer);
          setKeyAuthUser(keyAuthFromServer);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="bg-[#00000054] backdrop-blur-sm fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-center items-center text-white rounded-3xl bg-[#233e6f] h-[38rem] 2xl:h-[42rem] w-full lg:w-[42rem] 2xl:w-[48rem] p-6 mt-40 md:mt-0 pl-8 2xl:pl-12">
        
          <h1 className="text-xl md:text-2xl md:mb-6">
            Bind your account
          </h1>

          <h1 className="flex justify-start w-full">
            Go to&nbsp;
            <FcGoogle className="flex items-center text-xl mb-1"/>
            oogle Authenticator and there you have 2 options
          </h1>

          <div className="flex flex-row justify-start items-start w-full mt-4">
            <h1 className="flex justify-center items-center font-normal md:justify-start w-[50%]">
              1. Scan the QR code
            </h1>

            <div className="flex justify-center w-[50%] 2xl:w-[60%]">
              {qrImageBase64 && (
                <img
                  src={`data:image/png;base64,${qrImageBase64}`}
                  alt="QR Code"
                  className="max-w-[50%] border-4 border-black"
                />
                )} 
            </div>            
          </div>
          
          <div className="flex flex-row justify-start items-start w-full mt-6">
            <h1 className="font-normal w-[50%]">
              2. Or enter your email and your key
            </h1>

              <div className="flex flex-col justify-start items-center w-[50%]">
                <h1>
                  {localStorage.getItem('email')}
                </h1>

                {keyAuthUser && (
                <h1>{keyAuthUser}</h1>
                )}
              </div> 

          </div>

          <hr className="my-4 ml-6 mr-10  border-gray-300 w-full" />
          

          <h1 className="flex justify-start w-full">
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
              marginTop: '20px'
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
            onClick={handleVerifyOTP}
            className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] flex gap-1 items-center justify-center py-2 text-lg text-white rounded mt-8">
            Verify OTP
          </button>

          <button
          type="button"
          onClick={() => {setShowGAuth(false)}}  
          className="bg-blue-500 hover:bg-[#ef4444db] w-[17%] flex gap-1 items-center justify-center py-1 text-lg text-white rounded mt-4"          
          >
          Cancel
          </button>
            
        </div>
      </div>
    ) : null
  } 

  export { ModalGoogleAuth };