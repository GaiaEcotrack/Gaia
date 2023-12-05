import inImg from "../../assets/in.png";
import email2 from "../../assets/email2.jpeg";
import x from "../../assets/x.png";
import instagram from "../../assets/instagram.png";

function Footer() {
  return (
    <footer className="flex flex-col items-center text-center text-white ">
      <div className="container pt-9">
        <div className="flex flex-col items-center justify-center sm:flex-row">
          <a
            href="https://gear-tech.io/es"
            target="_blank"
            rel="noreferrer"
            className="mb-4"
          >
            <img
              src="/varaxgear.png"
              alt="Descripción de la imagen 1"
              className=""
            />
          </a>
          <a
            href="https://www.andromedacomputer.net/"
            target="_blank"
            rel="noreferrer"
          >
            <img src="/andromeda.png" alt="" className="w-72 h-48 mb-12" />
          </a>
          <a
            href="https://www.andromedacomputer.net/dapps/gaia-ecotrack.html"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src="/LOGOGAIASOLO.PNG"
              alt=""
              className="w-48 h-48 ml-16  mb-12"
            />
          </a>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-16">
        <a
          href="https://www.linkedin.com/company/andromeda-computer/mycompany/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={inImg}
            className="w-16 h-16 brightness-110 mix-blend-multiply"
            alt="LinkedIn"
          />
          <h2 className="mt-2 text-gray-900 ">LinkedIn</h2>
        </a>
        <a
          href="https://gmail.com/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank "
          rel="noreferrer"
        >
          <img
            src={email2}
            className="w-16 h-16 brightness-110 mix-blend-multiply"
            alt="email"
          />
          <h2 className="mt-2 text-gray-900">Email</h2>
        </a>
        <a
          href="https://twitter.com/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank "
          rel="noreferrer"
        >
          <img
            src={x}
            className="w-16 h-16 brightness-110 mix-blend-multiply"
            alt="x"
          />
          <h2 className="mt-2 text-gray-900">X</h2>
        </a>
        <a
          href="https://www.instagram.com/"
          className="mx-4 my-2 flex flex-col items-center"
          target="_blank "
          rel="noreferrer"
        >
          <img
            src={instagram}
            className="w-16 h-16 brightness-110 mix-blend-multiply"
            alt="instagram"
          />
          <h2 className="mt-2 text-gray-900">Instagram</h2>
        </a>
      </div>

      <div className="w-full bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200">
        © 2023 Copyright:
        <a
          className="text-neutral-800 dark:text-neutral-400"
          href="https://www.andromedacomputer.net/dapps/gaia-ecotrack.html" target="_blannk" rel="noreferrer"
        >
          Gaia Ecotrack
        </a>
      </div>
    </footer>
  );
}

export { Footer };
