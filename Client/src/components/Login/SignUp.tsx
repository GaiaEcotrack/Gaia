import { BsEye } from "react-icons/bs"; 
import { BsEyeSlash } from "react-icons/bs";
import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import Swal from 'sweetalert2'
import axios from "axios";

interface SignUp {
  showSignUp: boolean;
  setShowSignUp(showSignUp: boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
function SignUp(props:SignUp) {
  const URL = import.meta.env.VITE_APP_API_EXPRESS
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordConf, setPasswordConf] = useState("")
  const [visibleConf, setVisibleConf] = useState(false)

  const eye = <BsEye className="text-xl text-gray-800"/>
  const eyeSlash = <BsEyeSlash className="text-xl text-gray-800"/>

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) {
      return setError("Password fields are not available");
    }

    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError("Passwords do not match");
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(emailRef.current?.value)) {
      return setError("Invalid email format");
    }

    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.+])([A-Za-z\d@$!%*?&.]){8,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    if (!passwordRegex.test(passwordRef.current?.value)) {
      return setError("Passwords must be at least 6 characters with at least one letter and one number.");
    }
    // return setError("Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character");

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current?.value, passwordRef.current?.value).then(
        async(userCred: { user: any; }) => {
          const user = userCred.user;
          await sendEmailVerification(user)
        }
        );
        await axios.post(`${URL}/users`, {
          email: emailRef.current.value,
          full_name:"User"
        });
      navigate("/");
      setShowSignUp(false)
      Swal.fire({
        title: "Verify your account!",
        text: "Go to your email acount and check your inbox, then come back and Sign In",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "Ok !"
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use -- Sign in");
      } else {
        setError("Failed to create an account");
      }
    } finally {
      setLoading(false);
    }
  }

  const { showSignUp, setShowSignUp } = props;
    return showSignUp ? (
      <div className="bg-[#00000084] backdrop-blur-sm fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white rounded-3xl 2xl:pt-10 lg:h-[32rem] 2xl:h-[43rem] w-full lg:w-[23rem] 2xl:w-[32rem] md:py-6 md:mt-0">

          <div className="flex flex-col text-center item-center justify-center h-[20%] 2xl:h-[23%] laptop">
            <img className="w-32 h-32 mx-auto laptop" src="/LOGOGAIASOLO.png" alt="" />
            <h1 className="text-gray-800 text-3xl laptop">Gaia Ecotrack</h1>
          </div>

        <h1 className="text-gray-800 mt-4 2xl:mt-5 2xl:text-2xl font-bold 2xl:my-6">Sign Up</h1>

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

            <div className="mt-4 relative">
              <label htmlFor="password" className="block text-gray-800">
                Password
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
                Confirm Password
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

            {error && <div className="text-sm text-red-500 w-full mt-2">{error}</div>}

            <button         
              disabled={loading}
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-3 mt-4 2xl:mt-4"
            >
              Sign Up
            </button>

            <button className="text-black hover:text-indigo-900 flex justify-center w-full mt-4" onClick={() => {setShowSignUp(false); setError("")}}>Already have an account?  <strong> &nbsp; Log in</strong></button>
          
          </form>

          
        </div>
      </div>
    ) : null
  } 

  export { SignUp };
