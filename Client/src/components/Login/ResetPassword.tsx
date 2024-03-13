import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import axios from "axios";

interface SignUp {
  showResetPass: boolean;
  setShowResetPass(showResetPass: boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
function ResetPassword(props:SignUp) {

  const URL = import.meta.env.VITE_APP_API_URL  
  const emailRef = useRef<HTMLInputElement>(null);
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!emailRef.current) {
      return setError("Email does not exist");
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(emailRef.current?.value)) {
      return setError("Invalid email format");
    }

    try {
      setError("")
      setLoading(true)

      const response = await axios.get(`${URL}/users/search`, {
        params: {
          email: emailRef.current?.value,
        },
      });
  
      // Verificar si el usuario existe en la base de datos
      if (response.status === 200) {
        await resetPassword(emailRef.current?.value)
        navigate("/");
        setShowResetPass(false)
        Swal.fire({
          title: "Password Reset!",
          text: "Check your inbox for further instructions",
          icon: "info",
          confirmButtonColor: "#6366f1",
          confirmButtonText: "Ok !"
        });        
      }else{
        setLoading(false);
        return setError("User not found in the database");
      }

    } catch (error: any) {    
      setError("User not found in the database");    
    } finally {
      setLoading(false);
    }
  }

  const { showResetPass, setShowResetPass } = props;
    return showResetPass ? (
      <div className="bg-[#00000084] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white rounded-3xl 2xl:pt-10 lg:h-[16rem] 2xl:h-[22rem] w-full lg:w-[23rem] 2xl:w-[32rem] py-6 md:mt-0">

        <h1 className="text-gray-800 pb-4 2xl:pb-6 text-xl 2xl:text-2xl font-bold">Password Reset</h1>

          <form className="h-[35%] 2xl:h-[50%] w-[90%] 2xl:w-[70%] laptop" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-gray-800">
                Email Address
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoComplete="on"
                required
              />
            </div>

            {error && <div className="text-sm text-red-500 w-full mt-2 absolute">{error}</div>}

            <button         
              disabled={loading}
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-3 mt-8"
            >
              Reset Password
            </button>

            <button 
              className="text-black hover:text-indigo-900 flex justify-center w-full mt-4" 
              onClick={() => {setShowResetPass(false); setError("")}}><strong>Log in</strong>
            </button>
          
          </form>

        </div>
      </div>
    ) : null
  } 

  export { ResetPassword };
