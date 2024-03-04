import { Link, useNavigate} from "react-router-dom";
import { useRef, useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { SignUp } from "../../components/LoginSignUp/SignUp";
import '../../global.css'
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "../../contexts/AuthContext"
import { TwoFactorAuth } from "./TwoFactorAuth";
import axios from "axios";

/* eslint-disable */
export interface ILoginPageProps {}
  
function AuthForm (props: ILoginPageProps): JSX.Element {

  const URL = import.meta.env.VITE_APP_API_URL
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loadingE, setLoadingE] = useState(false)
  const [showTwoFA, setShowTwoFA] = useState(false)
  const [foundUserId, setFoundUserId] = useState('');

  // Funtion to log in with registered email 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  
    if (!emailRef.current || !passwordRef.current) {
      return setError("Password fields are not available");
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(emailRef.current?.value)) {
      return setError("Invalid email format");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    if (!passwordRegex.test(passwordRef.current?.value)) {
      return setError("Passwords must be at least 6 characters with at least one letter and one number.");
    }
  
    localStorage.clear();

    try {
      setError("");
      setLoadingE(true);
      await login(emailRef.current.value, passwordRef.current.value);
      const redirectPath = new URLSearchParams(window.location.search).get("redirect") || "/home";
      auth.onAuthStateChanged(async () => {    
        // Consultar la base de datos para obtener verified_2fa
        try {
          const response = await axios.get(`${URL}/users/search`, {
            params: {
              email: emailRef.current?.value,
            },
          });
    
          if (response.status === 200) {
            const verified2fa = response.data.verified_2fa;
            setFoundUserId(response.data._id); 

            if (verified2fa) {
              setShowTwoFA(true);
            } else {
              navigate(redirectPath);
            }
          } else {
            console.error('Error al buscar usuario:', response.status);
          }
        } catch (error: any) {
          if(error.message === "Request failed with status code 404"){
            navigate(redirectPath);
          } else{
            console.error('Error de red:', error);
          }
        }
      });
    } catch {
      setError("Incorrect username or password");
    } finally {
      setLoadingE(false);
    }
  }

  const email = emailRef.current?.value || "";
  localStorage.setItem("email", email);


  // ****************************************************************

  // Function to log in with GOOGLE  
  const signInWithGoogle = async () => {
    setAuthing(true);    
    // localStorage.clear();
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePic");
    localStorage.removeItem('id');
    localStorage.removeItem('completeCredent');
  
    try {
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
              
      const name = response.user.displayName || "Nombre";
      const email = response.user.email || "default@example.com";
      const profilePic = response.user.photoURL || "Photo Profile";
 
      localStorage.setItem("name", name);
      localStorage.setItem("profilePic", profilePic);  
      localStorage.setItem("email", email); 
  
      navigate('/home');
    } catch (error) {
      console.error(error);
      setAuthing(false);
    }
  };
  
    const imageUrl = 'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-cover bg-center hidden lg:flex  w-full md:w-1/2 xl:w-2/3 h-screen sm:flex sm:items-center sm:justify-center" style={{ backgroundImage: `url(${imageUrl})` }}>
        <h1 className="relative text-5xl">Blockchain Powers Your Green Energy</h1>
      </div>

      <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
     
          <form className="laptop w-full" onSubmit={handleSubmit}>

            <div className="flex flex-col gap-2 text-center item-center justify-center mb-4">
                <img className="w-32 h-32 mx-auto" src="/LOGOGAIASOLO.png" alt="" />
                <h1 className="text-gray-800 text-3xl">Gaia EcoTrack</h1>
            </div>
            <h1 className="flex justify-center text-2xl text-gray-800 font-bold 2xl:text-2xl leading-tight mb-6 2xl:mt-4">
              Log in to your account
            </h1>

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
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-800">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="text-right gap-5 mt-2">
              <Link
                to="/Forget"
                className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>

            {error && <div className="text-base text-red-500 w-full mt-2">{error}</div>}

            <button
              disabled={loadingE}
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-3 mt-3 2xl:mt-6"
              >
              Sign In
            </button>

            <div className="flex flex-col items-center mt-4">
              <button type="button"
                className="text-blue-500 hover:text-blue-700 font-semibold" 
                onClick={() => {setShowSignUp(true)}}
                >Create an account
              </button>
            </div>

            <button
              // onClick={signInWithGoogle}
              onClick={() => signInWithGoogle()} disabled={authing}
              type="button"
              className="w-full block bg-white hover:bg-blue-50 focus:bg-blue-50 text-gray-800 font-semibold rounded-lg px-4 py-3 border border-gray-300 mt-4"
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  className="w-6 h-6"
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <path
                      id="a"
                      d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                    />
                  </defs>
                  <clipPath id="b">
                    <use xlinkHref="#a" overflow="visible" />
                  </clipPath>
                  <path
                    clipPath="url(#b)"
                    fill="#FBBC05"
                    d="M0 37V11l17 13z"
                  />
                  <path
                    clipPath="url(#b)"
                    fill="#EA4335"
                    d="M0 11l17 13 7-6.1L48 14V0H0z"
                  />
                  <path
                    clipPath="url(#b)"
                    fill="#34A853"
                    d="M0 37l30-23 7.9 1L48 0v48H0z"
                  />
                  <path
                    clipPath="url(#b)"
                    fill="#4285F4"
                    d="M48 48L17 24l-4-3 35-10z"
                  />
                </svg>
                <span className="ml-4">
                  Log in with Google
                </span>
              </div>
            </button>

            {/* <Link className="w-full" to="/home">
              <button
                type="button"
                className="w-full block bg-white hover:bg-blue-50 focus:bg-blue-50 text-gray-800 font-semibold rounded-lg px-4 py-3 border border-gray-300 mt-6"
              >
                Enter as a guest
              </button>
            </Link> */}
          </form>         

  
      </div>
      <AuthProvider>
        <SignUp showSignUp={showSignUp} setShowSignUp={setShowSignUp}/>
      </AuthProvider>
      <TwoFactorAuth showTwoFA={showTwoFA} setShowTwoFA={setShowTwoFA} foundUserId={foundUserId}/>
    </section>
  );
};

export { AuthForm };