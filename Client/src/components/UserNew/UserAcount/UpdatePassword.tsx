import { BsEye } from "react-icons/bs"; 
import { BsEyeSlash } from "react-icons/bs";
import { useRef, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'

interface SignUp {
  showUpdPassw: boolean;
  setShowUpdPassw(showUpdPassw: boolean): void;
}

function UpdatePassword(props:SignUp) {

  const URL = import.meta.env.VITE_APP_API_URL
  // const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const { updPassword, currentUser } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [passwordConf, setPasswordConf] = useState("")
  const [visibleConf, setVisibleConf] = useState(false)

  const eye = <BsEye className="text-xl text-gray-800"/>
  const eyeSlash = <BsEyeSlash className="text-xl text-gray-800"/>

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!passwordRef.current || !passwordConfirmRef.current) {
      return setError("Password reference not available");
    }
  
    const newPassword = passwordRef.current.value;
    const confirmNewPassword = passwordConfirmRef.current.value;
  
    if (newPassword !== confirmNewPassword) {
      return setError("Passwords do not match");
    }
  
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError("Password must be at least 6 characters with at least one letter and one number.");
    }
  
    setLoading(true);
    setError("");
  
    updPassword(currentUser, newPassword)
    .then(() => {
      Toast.fire({
        icon: 'info',
        title: 'log in with your new password.'
      });
      navigate("/");
    })
    .catch((error: any) => {
      console.error("Error updating password:", error);
      setError("Error updating password");
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const { showUpdPassw, setShowUpdPassw } = props;
    return showUpdPassw ? (
      <div className="bg-[#00000084] backdrop-blur-sm fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white rounded-3xl 2xl:pt-10 lg:h-[22rem] 2xl:h-[29rem] w-full lg:w-[23rem] 2xl:w-[32rem] py-6 md:mt-0">

        <h1 className="text-gray-800 2xl:pb-6 text-xl 2xl:text-2xl font-bold">Update Password</h1>

          <form className="h-[35%] 2xl:h-[50%] w-[90%] 2xl:w-[70%] laptop" action="#" method="POST" onSubmit={handleSubmit}>
          <div className="mt-4 relative">
              <label htmlFor="password" className="block text-gray-800">
                New password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={visible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter Password"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none pr-10"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-4 right-0 p-2" onClick={() => setVisible(!visible)}>
                  {visible ? eye : eyeSlash}
                </div>
              </div>                
            </div>

            <div className="mt-4 relative">
              <label htmlFor="password-confirm" className="block text-gray-800">
                Confirm New password
              </label>
              <div className="relative">
                <input
                  ref={passwordConfirmRef}
                  type={visibleConf ? 'text' : 'password'}
                  id="password-confirm"
                  name="password-confirm"
                  placeholder="Confirm Password"
                  minLength={6}
                  className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none pr-10"
                  onChange={(e) => setPasswordConf(e.target.value)}
                  required
                />
                <div className="absolute inset-y-4 right-0 p-2" onClick={() => setVisibleConf(!visibleConf)}>
                  {visibleConf ? eye : eyeSlash}
                </div>
              </div>                
            </div>

            {error && <div className="text-sm text-red-500 2xl:w-[22rem] mt-2 absolute">{error}</div>}

            <button         
              disabled={loading}
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-3 mt-14"
            >
              Update Password
            </button>

            <button 
              className="flex justify-center w-full mt-4 cursor-auto" 
              onClick={() => {setShowUpdPassw(false); setError("")}}><strong className="text-black hover:text-red-600 cursor-pointer">Cancel</strong>
            </button>
          
          </form>

        </div>
      </div>
    ) : null
  } 

  export { UpdatePassword };