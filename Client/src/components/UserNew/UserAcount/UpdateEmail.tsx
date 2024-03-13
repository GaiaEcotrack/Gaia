import { useRef, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'

interface SignUp {
  showUpdEmail: boolean;
  setShowUpdEmail(showUpdEmail: boolean): void;
}

function UpdateEmail(props:SignUp) {

  const URL = import.meta.env.VITE_APP_API_URL
  const emailRef = useRef<HTMLInputElement>(null);
  const { updEmail, currentUser } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    if (!emailRef.current || !currentUser) {
      return setError("El correo electrónico no existe");
    }
  
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(emailRef.current.value)) {
      return setError("Formato de correo electrónico inválido");
    }
  
    setLoading(true);
    setError("");
  
    const currentEmail = currentUser.email;
    const newEmail = emailRef.current.value;
  
    if (newEmail !== currentEmail) {
      updEmail(currentUser, newEmail)
        .then(() => {
          const userId = localStorage.getItem('id');
          return axios.put(`${URL}/users/${userId}`, {
            email: newEmail
          });
        })
        .then(() => {
          Toast.fire({
            icon: 'success',
            title: 'log in with your new email'
          });
          navigate("/");
        })
        .catch((error: any) => {
          console.error("Error updating email:", error);
          setError("Error updating account");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Mail already exists");
      setLoading(false);
    }
  }

  const { showUpdEmail, setShowUpdEmail } = props;
    return showUpdEmail ? (
      <div className="bg-[#00000084] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white rounded-3xl 2xl:pt-10 lg:h-[16rem] 2xl:h-[22rem] w-full lg:w-[23rem] 2xl:w-[32rem] py-6 md:mt-0">

        <h1 className="text-gray-800 pb-4 2xl:pb-6 text-xl 2xl:text-2xl font-bold">Update Email</h1>

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
              Update Email
            </button>

            <button 
              className="text-black hover:text-red-600 flex justify-center w-full mt-4" 
              onClick={() => {setShowUpdEmail(false); setError("")}}><strong>Cancel</strong>
            </button>
          
          </form>

        </div>
      </div>
    ) : null
  } 

  export { UpdateEmail };