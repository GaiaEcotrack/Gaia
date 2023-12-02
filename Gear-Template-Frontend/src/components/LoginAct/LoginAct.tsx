import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export interface ILoginPageProps {}
  
function AuthForm (props: ILoginPageProps): JSX.Element {

  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);

  const signInWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
        .then((response) => {
            console.log(response.user.uid);
            console.log(response.user.displayName);
            console.log(response.user.photoURL);
            
            navigate('/home');
        })
        .catch((error) => {
            console.log(error);
            setAuthing(false);
        });
};

    const imageUrl = 'https://images.unsplash.com/photo-1467533003447-e295ff1b0435?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="bg-cover bg-center hidden lg:flex  w-full md:w-1/2 xl:w-2/3 h-screen sm:flex sm:items-center sm:justify-center" style={{ backgroundImage: `url(${imageUrl})` }}>
        <h1 className="relative text-5xl">Blockchain Impulsa Tu Energía Verde</h1>
      </div>

      <div className="bg-white/70 w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
        <div className="w-full h-100">
            <div className="flex flex-col gap-2 ml-16 sm:ml-32 lg:ml-44 item-center justify-center">
                <img className="w-32 h-32" src="/LOGOGAIASOLO.png" alt="" />
                <h1 className="text-black text-3xl">Gaia Ecotrack</h1>
            </div>
          <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
            Log in to your account
          </h1>

          <form className="mt-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email Address"
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoComplete="on"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter Password"
                minLength={6}
                className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
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

            <button
              type="submit"
              className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
            >
              Log In
            </button>
          </form>

          <hr className="my-6 border-gray-300 w-full" />

          <div className="flex flex-col gap-5 items-center">

          <Link className="w-full" to="/home">
            <button
              type="button"
              className="w-full block bg-gray-300 hover:bg-gray-400 focus:bg-gray-400 text-gray-800 font-semibold rounded-lg px-4 py-3 border border-gray-300"
            >
              Entrar como invitado
            </button>
          </Link>

          <button
            onClick={() => signInWithGoogle()} disabled={authing}
            type="button"
            className="w-full block bg-white hover:bg-gray-100 focus:bg-gray-100 text-gray-900 font-semibold rounded-lg px-4 py-3 border border-gray-300"
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

          <Link to="/register" className="text-blue-500 hover:text-blue-700 font-semibold">
            Create an account
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { AuthForm };