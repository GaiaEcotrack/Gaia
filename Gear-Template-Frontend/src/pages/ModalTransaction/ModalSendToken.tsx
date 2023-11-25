import { ConvertButton } from "pages/home/ConvertButton";
import { sendTokensFromGaia } from "pages/home/sendTokenFromGaia";
import { useState } from "react";

interface ModalProps {
  onClose: () => void; // La propiedad onClick espera una función que no devuelve ningún valor
}

function ModalSendToken ({onClose}:ModalProps) {
  const [userData, setUserData] = useState({
    usuario: "",
    cantidad: "",
    tipo: "tonkends",
    total: "",
  });
  

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de envío de datos si es necesario
    console.log("Datos enviados:", userData);
  };


  return (
    <div className="fixed bg-black/60 top-0 left-0 w-full h-full flex items-center justify-center">
      <div className="bg-secondary gap-5 rounded-3xl relative w-2/6 h-1/2 flex flex-col items-center justify-between">
        <div className="flex justify-end w-full">
          <button type="button" onClick={onClose} className="text-xl text-red-500 p-2.5">
            <svg
              width="20"
              height="23"
              viewBox="0 0 20 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="&#240;&#159;&#166;&#134; icon &#34;xrp (xrp)&#34;">
                <g id="Group">
                  <path
                    id="Vector"
                    d="M2.73058 0H1.16448C0.131544 0 -0.390467 1.25508 0.342586 1.98813L6.70679 8.35236C8.52834 10.1739 11.4717 10.1739 13.2932 8.35236L19.6574 1.98813C20.3905 1.25508 19.8684 0 18.8355 0H17.2694C16.3476 0 15.459 0.366527 14.8037 1.02183L10.8275 4.99809C10.3721 5.45347 9.63903 5.45347 9.18365 4.99809L5.20739 1.02183C4.54098 0.366527 3.65245 0 2.73058 0Z"
                    fill="white"
                  />
                  <path
                    id="Vector_2"
                    d="M2.73058 22.1788H1.16448C0.131544 22.1788 -0.390467 20.9239 0.342586 20.1908L6.70679 13.8266C8.52834 12.0051 11.4717 12.0051 13.2932 13.8266L19.6574 20.1908C20.3905 20.9239 19.8684 22.1788 18.8355 22.1788H17.2694C16.3476 22.1788 15.459 21.8123 14.8037 21.157L10.8275 17.1808C10.3721 16.7254 9.63903 16.7254 9.18365 17.1808L5.20739 21.157C4.54098 21.8123 3.65245 22.1788 2.73058 22.1788Z"
                    fill="white"
                  />
                </g>
              </g>
            </svg>
          </button>
        </div>

        <h1 className=" text-3xl">Enviar Dinero</h1>

        <div className="bg-white text-black w-full rounded-3xl h-full">
          <form onSubmit={handleSubmit}>
          <div className="mb-4 mt-5 p-2.5">
            <label
              htmlFor="usuario"
              className="block text-sm font-medium text-gray-600"
            >
              Usuario
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={userData.usuario}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div className="mb-4 p-2.5 flex">
            <div className="mr-2 w-1/2">
              <label
                htmlFor="cantidad"
                className="block text-sm font-medium text-gray-600"
              >
                Cantidad
              </label>
              <input
                type="text"
                id="cantidad"
                name="cantidad"
                value={userData.cantidad}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            <div className="ml-2 w-1/2 p-2.5">
              <label
                htmlFor="tipo"
                className="block text-sm font-medium text-gray-600"
              >
                Tipo
              </label>
              <select
                id="tipo"
                name="tipo"
                value={userData.tipo}
                onChange={handleChange}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="tonkends">Tonkends</option>
                <option value="nfts">NFTs</option>
              </select>
            </div>
          </div>

          <div className="mb-4 p-2.5">
            <label
              htmlFor="total"
              className="block text-sm font-medium text-gray-600"
            >
              Total
            </label>
            <input
              type="text"
              id="total"
              name="total"
              value={userData.total}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="flex justify-center">
          <button
            type="submit"
            className="bg-secondary text-white px-4 py-2 rounded-md mb-5"
          >
            Enviar
          </button>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export  {ModalSendToken}
