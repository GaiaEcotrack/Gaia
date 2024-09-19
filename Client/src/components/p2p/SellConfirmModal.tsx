import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Swal from "sweetalert2";

interface UserData {
  _id: string;
  name: string;
  email: string;
  wallet: {
    willing_to_sell_excess: boolean;
    amount_kwh_to_sell: number;
    // Otros campos de la wallet si los hay
  };
  // Otros campos del usuario si los hay
}

interface ConfirmSellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (kwhAmount: number) => void; // Actualizamos la firma de onConfirm para que reciba el número de kWh
  maxAvailableKwh: number;
}

const SellConfirmModal: React.FC<ConfirmSellModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  maxAvailableKwh,
}) => {
  // const dispatch = useDispatch();
  // const mongoUserId = useSelector((state: RootState) => state.user.mongoUserId);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [kwhAmount, setKwhAmount] = useState(0);
  // const [users, setUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
        console.log("User ID:", user.uid); //userId firebase
        // dispatch(setMongoUserId(user.uid)); // Aquí establecemos el ID de MongoDB en el estado de Redux
      } else {
        setLoggedInUser(null);
      }
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, []);

  // Función para obtener datos del usuario desde el backend
  useEffect(() => {
    const url = `http://127.0.0.1:5000/users/selling`; // Endpoint para obtener los usuarios que quieren vender
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data); // Guardar los usuarios en el estado
        console.log("Users willing to sell fetched:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  // Función para manejar el clic en "Yes"
  const handleConfirm = () => {
    setShowInput(true);
  };

  // Función para manejar el cambio en el input de kWh
  const handleKwhAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputKwh = Number(e.target.value);
    console.log("maxAvailableKwh:", maxAvailableKwh);
    console.log("inputKwh:", inputKwh);
    if (inputKwh >= 0 && inputKwh <= maxAvailableKwh) {
      setKwhAmount(inputKwh);
      setIsConfirmDisabled(false);
    } else if (inputKwh < 0) {
      setIsConfirmDisabled(true);
      Swal.fire("Please enter a positive value.");
    } else {
      Swal.fire(`You can't sell more than ${maxAvailableKwh} kWh.`);
    }
  };

  // Función para manejar el clic en "Submit"
  const handleSubmit = () => {
    const mongoUserId = localStorage.getItem("id");
    if (!mongoUserId) {
      console.error("No MongoDB user ID found in localStorage");
      return;
    }

    const url = `http://127.0.0.1:5000/users/${mongoUserId}/wallet`;
    const data = {
      willing_to_sell_excess: true,
      amount_kwh_to_sell: kwhAmount,
    };

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user data");
        }
        return response.json();
      })
      .then((updatedData) => {
        console.log("User update successful:", updatedData);
        // Cerrar el modal después de actualizar los datos del usuario
        onClose();
        // Realizar una nueva solicitud para obtener la lista actualizada de usuarios
        return fetch(`http://127.0.0.1:5000/users/selling`);
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received from backend:", data);
        setUsers(data); // Actualizar la lista de usuarios con los datos más recientes
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };
  // funcion para el boton cancel

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-lg md:text-xl text-center text-gray-900 font-semibold title-font mb-2 hover:cursor-pointer">
          Welcome, <span className="text-blue-500">{loggedInUser?.email}</span>
        </h3>
        <h2 className="text-md md:text-lg font-semibold text-center text-gray-900 mb-4">
          Do you want to be part of p2p commerce?
        </h2>

        {showInput ? (
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
              className="w-full bg-gray-100 rounded-md py-2 px-4 border border-gray-300 text-black focus:outline-none focus:border-blue-500"
              value={kwhAmount}
              onChange={handleKwhAmountChange}
              placeholder="Enter kWh amount"
            />
            <div className="flex justify-center">
              <button
                className="m-2 transition duration-150 ease-in-out bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={handleSubmit}
                disabled={isConfirmDisabled}
              >
                Confirm
              </button>
              <button
                className="m-2 transition duration-150 ease-in-out bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
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
            <div className="mt-5">
              <ul>
                {users.map((user) => (
                  <li key={user._id}>
                    {user.name} - {user.email} - kWh to sell:{" "}
                    {user.wallet && user.wallet.willing_to_sell_excess
                      ? user.wallet.amount_kwh_to_sell
                      : "N/A"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellConfirmModal;
