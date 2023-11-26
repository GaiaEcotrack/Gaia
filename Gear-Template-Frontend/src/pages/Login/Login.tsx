import { Link, NavLink } from "react-router-dom";

import FacebookIcon from "../../assets/FacebookIcon.svg";
import LogoGaia from "../../assets/LogoGaia.svg";
import GoogleIcon from "../../assets/GoogleIcon.svg";

export function Welcome () {
  const isDesktop = window.innerWidth >= 1024;

  return (
    <div className="bg-white">
      <Link to="/w">
        <button type="button" className="text-white hover:text-gray-300">
          Dispositivos encontrados
        </button >
      </Link>
      <div className="h-screen flex justify-center items-center">
        <div
          className={`text-center ${
            isDesktop ? "w-[447px] h-[542px]" : "w-[334px] h-[440px]"
          } bg-white rounded-2xl shadow-md p-8`}
        >
          <img
            className={`${isDesktop ? "w-10 h-10" : "w-8 h-8"} m-auto mb-6 object-cover `}
            src={LogoGaia}
            alt="Logo de Gaia-Ecotrack"
          />
          <h1
            className={`mt-3 text-2xl ${
              isDesktop ? "text-gray-800" : "text-gray-700"
            } font-inter font-normal`}
          >
            Bienvenido a Gaia-Ecotrack
          </h1>

          <div className="p-4 mt-12">
            <button type="button"
              className={`w-full ${
                isDesktop ? "h-16" : "h-12"
              } rounded-full border-none bg-white shadow-md flex items-center cursor-pointer`}
            >
              <img
                className={`${
                  isDesktop ? "w-8 h-8" : "w-6 h-6"
                } m-auto object-cover`}
                src={GoogleIcon}
                alt="Icono de Google"
              />
              <p
                className={`${
                  isDesktop ? "text-base" : "text-xs"
                } text-gray-700 m-auto font-inter font-medium`}
              >
                Continuar con Google
              </p>
            </button >
            <button type="button"
              className={`w-full ${
                isDesktop ? "h-16" : "h-12"
              } rounded-full border-none bg-white shadow-md flex items-center cursor-pointer mt-4`}
            >
              <img
                className={`${
                  isDesktop ? "w-8 h-8" : "w-6 h-6"
                } m-auto object-cover`}
                src={FacebookIcon}
                alt="Icono de Facebook"
              />
              <p
                className={`${
                  isDesktop ? "text-base" : "text-xs"
                } text-gray-700 m-auto font-inter font-medium `}
              >
                Continuar con Facebook
              </p>
            </button >
            <NavLink to='/'>
            <button type="button" className="w-1/3 bg-blue-500 rounded-full mt-8">
              Ingresar
              </button >
              </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};
