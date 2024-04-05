import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface ConfirmSellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (kwhAmount: number) => void; // Actualizamos la firma de onConfirm para que reciba el número de kWh
}

const SellConfirmModal: React.FC<ConfirmSellModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showInput, setShowInput] = useState(false); // Nuevo estado para controlar si se muestra el input
  const [kwhAmount, setKwhAmount] = useState(0); // Nuevo estado para almacenar la cantidad de kWh

  // Función para manejar el clic en "Yes"
  const handleConfirm = () => {
    setShowInput(true); // Mostramos el input
  };

  // Función para manejar el cambio en el input de kWh
  const handleKwhAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKwhAmount(Number(e.target.value)); // Convertimos el valor a número y lo almacenamos en el estado
  };

  // Función para manejar el clic en "Submit"
  const handleSubmit = () => {
    onConfirm(kwhAmount); // Llamamos a la función onConfirm con el valor de kWh como argumento
  };

  // Efecto para obtener el usuario actual
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-lg md:text-xl text-center text-gray-900 font-semibold title-font mb-2 hover:cursor-pointer">
          Welcome,{" "}
          <span className="text-blue-500">{loggedInUser?.email}</span>
        </h3>
        <h2 className="text-md md:text-lg font-semibold text-center text-gray-900 mb-4">
          Do you want to be part of p2p commerce?
        </h2>

        {showInput ? ( // Mostramos el input solo si showInput es true
          <div className="mt-5 flex flex-col items-center">
            <label
              htmlFor="kwhAmount"
              className="mb-2 text-md font-semibold text-gray-900"
            >
              How many kWh do you want to sell?
            </label>
            <input
              type="number"
              id="kwhAmount"
              className="w-full bg-gray-100 rounded-md py-2 px-4 border border-gray-300  text-black focus:outline-none focus:border-blue-500"
              value={kwhAmount}
              onChange={handleKwhAmountChange}
              placeholder="Enter kWh amount"
            />
            <button
              className="mt-4 transition duration-150 ease-in-out bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleSubmit}
            >
              Confirm
            </button>
          </div>
        ) : (
          <div className="mt-5 flex justify-center space-x-4">
            <button
              className="transition duration-150 ease-in-out bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
              onClick={handleConfirm}
            >
              Yes
            </button>
            <button
              className="transition duration-150 ease-in-out bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
              onClick={onClose}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellConfirmModal;