import { BsEye } from "react-icons/bs"; 
import { BsEyeSlash } from "react-icons/bs";
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

function SignUpInstaller(props: SignUp) {
  const URL = import.meta.env.VITE_APP_API_EXPRESS;
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const nitRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const companyPhoneRef = useRef<HTMLInputElement>(null);
  const companyEmailRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);
  const legalRepNameRef = useRef<HTMLInputElement>(null);
  const legalRepIdRef = useRef<HTMLInputElement>(null);
  const legalRepEmailRef = useRef<HTMLInputElement>(null);
  const legalRepPhoneRef = useRef<HTMLInputElement>(null);

  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [passwordConf, setPasswordConf] = useState("");
  const [visibleConf, setVisibleConf] = useState(false);

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

    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value).then(
        async (userCred: { user: any; }) => {
          const user = userCred.user;
          await sendEmailVerification(user); 
        }
      );

      await axios.post(`${URL}/comercial/users`, {
        email: emailRef.current.value,
        full_name: "User",
        company_name: companyNameRef.current?.value,
        nit: nitRef.current?.value,
        address: addressRef.current?.value,
        company_phone: companyPhoneRef.current?.value,
        company_email: companyEmailRef.current?.value,
        website: websiteRef.current?.value,
        legal_representative_name: legalRepNameRef.current?.value,
        legal_representative_id: legalRepIdRef.current?.value,
        legal_representative_email: legalRepEmailRef.current?.value,
        legal_representative_phone: legalRepPhoneRef.current?.value,
        role:"comercial"
      });

      navigate("/");
      setShowSignUp(false);
      Swal.fire({
        title: "Verify your account!",
        text: "Go to your email account and check your inbox, then come back and Sign In",
        icon: "info",
        confirmButtonColor: "#6366f1",
        confirmButtonText: "Ok !"
      });
      setPassword("")
      setPasswordConf("")
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
  <div className="flex flex-col justify-start items-center bg-white rounded-3xl 2xl:pt-10 w-full lg:w-[90rem] 2xl:w-[90rem]  md:py-6 md:mt-0 relative p-8 laptop">
    <div className="flex flex-col text-center items-center justify-center h-[20%] lg:h-[23%]">
      <img className="w-24 h-24 lg:w-32 lg:h-32 mx-auto" src="/LOGOGAIASOLO.png" alt="Gaia Ecotrack Logo" />
      <h1 className="text-gray-800 text-2xl lg:text-3xl">Gaia Ecotrack</h1>
    </div>

    <h1 className="text-gray-800 mt-4 text-xl lg:text-2xl font-bold lg:my-6">Sign Up</h1>

    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 w-full" action="#" method="POST" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="company-name" className="block text-gray-800">Nombre de la Empresa</label>
        <input
          ref={companyNameRef}
          type="text"
          id="company-name"
          name="company-name"
          placeholder="Ingrese el nombre de la empresa"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="nit" className="block text-gray-800">Número de Identificación Tributaria (NIT)</label>
        <input
          ref={nitRef}
          type="text"
          id="nit"
          name="nit"
          placeholder="Ingrese el NIT"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-gray-800">Dirección Física</label>
        <input
          ref={addressRef}
          type="text"
          id="address"
          name="address"
          placeholder="Ingrese la dirección física"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="company-phone" className="block text-gray-800">Teléfono de Contacto</label>
        <input
          ref={companyPhoneRef}
          type="text"
          id="company-phone"
          name="company-phone"
          placeholder="Ingrese el teléfono de contacto"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="company-email" className="block text-gray-800">Correo Electrónico de la Empresa</label>
        <input
          ref={companyEmailRef}
          type="email"
          id="company-email"
          name="company-email"
          placeholder="Ingrese el correo electrónico de la empresa"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-gray-800">Sitio Web (opcional)</label>
        <input
          ref={websiteRef}
          type="url"
          id="website"
          name="website"
          placeholder="Ingrese el sitio web"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="legal-rep-name" className="block text-gray-800">Nombre del Representante Legal</label>
        <input
          ref={legalRepNameRef}
          type="text"
          id="legal-rep-name"
          name="legal-rep-name"
          placeholder="Ingrese el nombre del representante legal"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="legal-rep-id" className="block text-gray-800">Número de Identificación del Representante Legal</label>
        <input
          ref={legalRepIdRef}
          type="text"
          id="legal-rep-id"
          name="legal-rep-id"
          placeholder="Ingrese el número de identificación del representante legal"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="legal-rep-email" className="block text-gray-800">Correo Electrónico del Representante Legal</label>
        <input
          ref={legalRepEmailRef}
          type="email"
          id="legal-rep-email"
          name="legal-rep-email"
          placeholder="Ingrese el correo electrónico del representante legal"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="legal-rep-phone" className="block text-gray-800">Teléfono del Representante Legal</label>
        <input
          ref={legalRepPhoneRef}
          type="text"
          id="legal-rep-phone"
          name="legal-rep-phone"
          placeholder="Ingrese el teléfono del representante legal"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-gray-800">Email Personal</label>
        <input
          ref={emailRef}
          type="email"
          id="email"
          name="email"
          placeholder="Ingresa tu Email"
          className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-gray-800">Password</label>
        <div className="relative w-full">
          <input
            ref={passwordRef}
            id="password"
            name="password"
            placeholder="Enter your Password"
            className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={() => setVisible(!visible)} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {visible ? eye : eyeSlash}
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="password-confirm" className="block text-gray-800">Confirm Password</label>
        <div className="relative w-full">
          <input
            ref={passwordConfirmRef}
            id="password-confirm"
            name="password-confirm"
            placeholder="Confirm your Password"
            className="w-full px-4 py-3 rounded-lg text-black bg-gray-100 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
            type={visibleConf ? "text" : "password"}
            value={passwordConf}
            onChange={(e) => setPasswordConf(e.target.value)}
            required
          />
          <span onClick={() => setVisibleConf(!visibleConf)} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
            {visibleConf ? eye : eyeSlash}
          </span>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2 col-span-full">{error}</p>}
      <button
        disabled={loading}
        type="submit"
        className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
      >
        Sign Up
      </button>
    </form>


    <button
      className="absolute top-0 right-0 mt-4 mr-4 text-gray-800 hover:text-gray-600"
      onClick={() => setShowSignUp(false)}
    >
      X
    </button>
  </div>
</div>

  ) : null;
}

export default SignUpInstaller;
