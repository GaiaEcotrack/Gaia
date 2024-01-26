import { FaInstagram,FaTwitter,FaLinkedinIn } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


function Footer() {
  return (
    <footer className="flex flex-col items-center text-center text-white">
      <div className="container lg:pt-9">
        <div className="flex items-center justify-evenly sm:flex-row mb-8 lg:mb-14">

          <div >
            <a
              href="https://vara-network.io/"
              target="_blank"
              rel="noreferrer"
              className="mb-4"
            >
              <img
                src="/VaraWhite.png"
                alt="Descripción de la imagen 1"
                className="w-16 h-12 sm:w-48 sm:h-32"
              />
            </a>
          </div>

          <div>
            <a
              href="https://www.andromedacomputer.net/"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/andromeda.png" alt="" className="w-16 h-12 sm:w-48 sm:h-32" />
            </a>
          </div>

          <div>
            <a
              href="https://www.andromedacomputer.net/dapps/gaia-ecotrack.html"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/LOGOGAIASOLO.png"
                alt=""
                className=" w-[50px] h-12 sm:w-28 sm:h-28 "
              />
            </a>
          </div>
          
        </div>
      </div>
      <div className="flex z-10 sm:flex-row sm:gap-16">
        <a
          href="https://www.linkedin.com/showcase/gaia-ecotrack/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank"
          rel="noreferrer"
        >
<FaLinkedinIn color="white" className="text-3xl sm:text-7xl sm:w-14 sm:h-14" />
          <h2 className="mt-2 text-white ">LinkedIn</h2>
        </a>
        <a
          href="mailto:gaia_ecotrack@andromedacomputer.net/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank "
          rel="noreferrer"
        >
<MdEmail color="white" className="text-3xl sm:text-7xl sm:w-14 sm:h-14" />
          <h2 className="mt-2 text-white">Email</h2>
        </a>
        <a
          href="https://twitter.com/Gaia_Ecotrack"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank "
          rel="noreferrer"
        >
< FaTwitter color="white" className="text-3xl sm:text-7xl sm:w-14 sm:h-14" />
          <h2 className="mt-2 text-white">X</h2>
        </a>
        <a
          href="https://www.instagram.com/gaiaecotrack/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank "
          rel="noreferrer"
        >
<FaInstagram color="white" className="text-3xl sm:text-7xl sm:w-14 sm:h-14"/>
          <h2 className="mt-2 text-white">Instagram</h2>
        </a>
      </div>

      <div className="w-full gap-5 p-4 text-center text-white dark:bg-neutral-700 dark:text-neutral-200">
        © 2023 Copyright:
        <a
          className="text-white dark:text-neutral-400"
          href="https://www.andromedacomputer.net/dapps/gaia-ecotrack.html" target="_blannk" rel="noreferrer"
        >
          Gaia Ecotrack
        </a>
      </div>
    </footer>
  );
}

export { Footer };
