import { useRef, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";

interface SignUp {
  showSignUp: boolean;
  setShowSignUp(showSignUp: boolean): void;
}

function SignUp(props:SignUp) {

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) {
      return setError("Password fields are not available");
    }

    if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
      return setError("Passwords do not match");
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current?.value, passwordRef.current?.value)
      navigate("/");
      setShowSignUp(false)
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }

  // console.log(currentUser)
  // console.log(emailRef.current?.value)

  const { showSignUp, setShowSignUp } = props;
    return showSignUp ? (
      <div className="bg-[#00000073] fixed top-0 left-0 h-full w-full flex justify-center items-center">
        
        <div className="flex flex-col justify-start items-center bg-white rounded-3xl h-[100%] md:h-[85%] w-full md:w-[50%] lg:w-[30%] 2xl:h-[80%] 2xl:w-[40%] p-4 md:p-6 mt-40 md:mt-0">

          <div className="flex flex-col text-center item-center justify-center h-[25%] laptop">
            <img className="w-32 h-32 mx-auto laptop" src="/LOGOGAIASOLO.png" alt="" />
            <h1 className="text-black text-3xl laptop">Gaia Ecotrack</h1>
          </div>

        <h1 className="text-black mt-4 2xl:mt-5 2xl:text-2xl font-bold 2xl:my-6">Sign Up</h1>

        <form className="h-[35%] 2xl:h-[50%] w-[90%] 2xl:w-[70%] laptop" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email Address
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 rounded-lg text-black bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoComplete="on"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                ref={passwordRef}
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 text-black rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-700">
                Password Confirmation
              </label>
              <input
                ref={passwordConfirmRef}
                type="password"
                id="password-confirm"
                name="password"
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 text-black rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button              
              disabled={loading}
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6 2xl:mt-10"
            >
              Sign Up
            </button>

            <button className="text-black flex justify-center w-full mt-4" onClick={() => {setShowSignUp(false)}}>Already have an account?  <strong> &nbsp; Log in</strong></button>
          
          </form>

          
        </div>
      </div>
    ) : null
  } 

  export { SignUp };
