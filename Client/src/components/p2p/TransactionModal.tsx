import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";

interface RowData {
  id: string;
  orders: number;
  completion: string;
  rate: string;
  price: string;
  available: string;
  limit: string;
  paymentMethods: PaymentMethodData[];
}

interface TransactionModalProps {
  isOpen: boolean;
  closeModal: () => void;
  rowData: RowData | null;
  mode: "Buy" | "Sell";
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  closeModal,
  rowData,
  mode,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [kwAmount, setKwAmount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [cryptoPrice, setCryptoPrice] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_APP_API_URL;
        const { data } = await axios.get(`${URL}/coinbase`);
        const varaPrice = data.vara.price.data.amount; // Accediendo directamente al precio de Vara
        console.log(varaPrice); // Verificar que tenemos el precio correcto
        setCryptoPrice(varaPrice); // Almacenando solo el precio de Vara en el estado
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numericValue = parseFloat(e.target.value); // Convertir el valor a float para la comparación y el cálculo

    // Verificar y corregir el valor si es negativo
    if (numericValue < 0) {
      numericValue = 0;
      setInputValue("0");
    } else {
      setInputValue(e.target.value); // Usar el valor ingresado si es positivo
    }

    const priceOfVaraInUSD = parseFloat(cryptoPrice) || 0;
    const usdAmount = numericValue * priceOfVaraInUSD; // Convertir Varas a USD
    const kwBought = usdAmount / 0.2; // Calcular los KW que se pueden comprar con esos USD

    setKwAmount(kwBought); // setKwAmount ahora tiene el número de KW que el usuario puede comprar
  };

  //usuario desde firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen || !rowData) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full ${
        !isOpen && "hidden"
      }`}
    >
      <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
        {/* Contenido del modal */}
        <div className="flex justify-between items-center">
          <div className="p-4 m-2 border-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {loggedInUser?.email || "Unknown"}
            </h3>
            <p className="text-gray-900 m-2">{`${rowData?.orders} órdenes | ${rowData?.completion} Completado`}</p>
            <p className="text-gray-900 m-2">Success: {rowData?.rate}</p>
            <p className="text-gray-900 m-2">Price: {rowData?.price}</p>
            <p className="text-gray-900 m-2">Available: {rowData?.available}</p>
            <p className="text-gray-900 m-2">Limit: {rowData?.limit}</p>
            <p className="text-gray-900 m-2">
              Payment type: {rowData?.paymentMethods.join(", ")}
            </p>
          </div>
          <div className="p-4 m-2 border-2">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-900"
            >
              I want to pay (VARAS):
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="amount"
                id="amount"
                value={inputValue}
                onChange={handleInputChange}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm text-gray-900 border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div className="mt-4">
              <p className="text-gray-900">
                I will receive (KW): {kwAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={closeModal}
            className="bg-gray-200 hover:bg-gray-300 rounded text-black px-4 py-2"
          >
            Close
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded text-white ${
              mode === "Buy"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-700 hover:bg-red-600"
            }`}
          >
            {mode === "Buy" ? "Buy" : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;

//! 1 kw 0,2 == gaias
//! 10  varas == 0.8 usdt (aprox al dia de hoy)
//! para saber cuanto puedo comprar con 10 varas:
//! 0.8 usdt / 0,2 gaias == 4kw
