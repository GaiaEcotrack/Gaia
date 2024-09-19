import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import Swal from 'sweetalert2';
import axios from "axios";

interface SignUp {
  showSignUp: boolean;
  setShowSignUp(showSignUp: boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
function SignUp(props: SignUp) {
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [passwordConf, setPasswordConf] = useState("");
  const [visibleConf, setVisibleConf] = useState(false);
  const [accountType, setAccountType] = useState<string>(""); // New state for account type
  const [companyName, setCompanyName] = useState<string>(""); // New state for company name

  const eye = <BsEye className="text-xl text-gray-800" />;
  const eyeSlash = <BsEyeSlash className="text-xl text-gray-800" />;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailRef.current || !passwordRef.current || !passwordConfirmRef.current) {
      return setError("Password fields are not available");
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailRegex.test(emailRef.current.value)) {
      return setError("Invalid email format");
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
    if (!passwordRegex.test(passwordRef.current.value)) {
      return setError("Passwords must be at least 6 characters with at least one letter and one number.");
    }

    if (!accountType) {
      return setError("Please select an account type.");
    }

    if (accountType === "installer" && !companyName) {
      return setError("Please provide a company name.");
    }

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        async (userCred: { user: any }) => {
          const user = userCred.user;
          await sendEmailVerification(user);
        }
      );
      await axios.post(`${URL}/users`, {
        email: emailRef.current.value,
        full_name: "User",
        role:accountType,
        installation_company: accountType === "Installer" ? companyName : null // Send the company name only if installer is selected
      });
      navigate("/");
      setShowSignUp(false);
      Swal.fire({
        title: "Verify your account!",
        text: "Go to your email account and check your inbox, then come back and Sign In",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "Ok!"
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
      <div className="flex flex-col justify-start items-center bg-white rounded-3xl lg:h-[60rem] w-full lg:w-[23rem] md:py-6">

        <div className="text-center">
          <img className="w-32 h-32 mx-auto" src="/LOGOGAIASOLO.png" alt="Logo" />
          <h1 className="text-gray-800 text-3xl">Gaia Ecotrack</h1>
        </div>

        <h1 className="text-gray-800 mt-4 text-2xl font-bold">Sign Up</h1>

        {/* Account Type Selection */}
        <div className="mt-4">
          <label className="block text-gray-800">Select Account Type</label>
          <div className="flex justify-between mt-2">
            <button
              className={`px-4 py-2 rounded-lg ${accountType === "Comercial" ? "bg-indigo-500 text-white" : "bg-gray-100 text-black"}`}
              onClick={() => setAccountType("Comercial")}
              type="button"
            >
              Comercial
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${accountType === "Installer" ? "bg-indigo-500 text-white" : "bg-gray-100 text-black"}`}
              onClick={() => setAccountType("Installer")}
              type="button"
            >
              Installer
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${accountType === "Generator" ? "bg-indigo-500 text-white" : "bg-gray-100 text-black"}`}
              onClick={() => setAccountType("Generator")}
              type="button"
            >
              Final User
            </button>
          </div>
        </div>

        {/* Conditionally render the Company Name input if installer is selected */}


        <form className="mt-4 w-[90%]" onSubmit={handleSubmit}>
        {accountType === "Installer" && (
          <div className="mt-4">
            <label htmlFor="company-name" className="block text-gray-800">Company Name</label>
            <input
              type="text"
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name"
              className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white"
              required
            />
          </div>
        )}
          <div>
            <label htmlFor="email" className="block text-gray-800">Email Address</label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              placeholder="Enter Email Address"
              className="w-full px-4 py-3 rounded-lg   text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white"
              required
            />
          </div>

          <div className="mt-4 relative">
            <label htmlFor="password" className="block text-gray-800">Password</label>
            <input
              ref={passwordRef}
              type={visible ? 'text' : 'password'}
              id="password"
              className="w-full  text-black px-4 py-3 rounded-lg bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white pr-10"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 p-2" onClick={() => setVisible(!visible)}>
              {visible ? eye : eyeSlash}
            </div>
          </div>

          <div className="mt-4 relative">
            <label htmlFor="password-confirm" className="block text-gray-800">Confirm Password</label>
            <input
              ref={passwordConfirmRef}
              type={visibleConf ? 'text' : 'password'}
              id="password-confirm"
              className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white pr-10"
              onChange={(e) => setPasswordConf(e.target.value)}
              required
            />
            <div className="absolute inset-y-0 right-0 p-2" onClick={() => setVisibleConf(!visibleConf)}>
              {visibleConf ? eye : eyeSlash}
            </div>
          </div>

          {error && <div className="text-red-500 mt-2">{error}</div>}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg px-4 py-3 mt-4"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  ) : null;
}

export { SignUp };