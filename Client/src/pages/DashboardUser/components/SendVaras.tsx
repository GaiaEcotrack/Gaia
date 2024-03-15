import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const SendVaras = ({ close }: any) => {
  const alert = () => {
    let timerInterval;
    Swal.fire({
      title: "Information sent!",
      html: "in 24 hours you will see your Vara's deposited in your gate io account.",
      timer: 15000,
      icon: "success",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log("I was closed by the timer");
      }
    });
  };
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    direccionDeposito: "",
    tipoPago: "",
    id: localStorage.getItem("idUserRedux"),
  });

  const handleChange = (e: any) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const url = import.meta.env.VITE_APP_API_URL;
      await axios.post(`${url}/payments/`, {
        address: datos.direccionDeposito,
        email: datos.email,
        name: datos.nombre,
        payment_type: datos.tipoPago,
        user_id: datos.id,
        status: "pendig",
      });
      close();
      alert()
      console.log(datos);
    } catch (error) {
      console.log(error);
    }
    close(); // Aquí puedes hacer lo que quieras con los datos, como enviarlos a un servidor, etc.
  };
  console.log(datos);

  return (
    <div className="fixed bg-black/60 top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="w-full flex flex-col items-center justify-center max-w-md bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">
          Claim your Vara's
        </h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-white font-semibold mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-white font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={datos.email}
              onChange={handleChange}
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="direccionDeposito"
              className="block text-white font-semibold mb-1"
            >
              Deposit address of gate io
            </label>
            <input
              type="text"
              id="direccionDeposito"
              name="direccionDeposito"
              value={datos.direccionDeposito}
              onChange={handleChange}
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div
              role="alert"
              className="relative flex w-full px-4 py-4 text-base text-white bg-gray-800 rounded-lg font-regular"
            >
              <div className="shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  ></path>
                </svg>
              </div>
              <div className="ml-3 mr-12">
                Make sure you enter the correct address, you may lose your
                funds.
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="tipoPago"
              className="block text-white font-semibold mb-1"
            >
              Type of payment
            </label>
            <select
              id="tipoPago"
              name="tipoPago"
              value={datos.tipoPago}
              onChange={handleChange}
              className="w-full text-black px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option className="text-black" value="">
                Selecciona un tipo de pago
              </option>
              <option className="text-black" value="Mercado Pago">
                Mercado Pago
              </option>
              <option className="text-black" value="Coinbase">
                Coinbase
              </option>
              <option className="text-black" value="Paypal">
                Paypal
              </option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-green-600 hover:to-blue-600 transition ease-in-out duration-150"
          >
            Enviar
          </button>
          <button
            onClick={close}
            type="button"
            className="bg-red-600 text-white font-bold py-2 px-4 rounded-md mt-4  transition ease-in-out duration-150"
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendVaras;
