import { useState, useEffect } from "react";
import TransactionModal from "./TransactionModal";
import { auth } from "../../firebase"; 
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";

type PaymentMethod = "Polkadot wallet";

interface RowData {
  id: string;
  orders: number;
  completion: string;
  rate: string;
  price: string;
  available: string;
  // limit: string;
  paymentMethods: PaymentMethod[];
}

interface P2PTableProps {
  mode: "Buy" | "Sell";
}
const P2PTable: React.FC<P2PTableProps> = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [cryptoPrice, setCryptoPrice] = useState("")

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
    fetchData()
  },[])
  // Traer datos reales
  const rows: RowData[] = [
    {
      id: "User1",
      orders: 1190,
      completion: "100.00%",
      rate: "99%",
      price: "0,09",
      available: "66 Gaias",
      // limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Polkadot wallet"],
    },
    {
      id: "xUser",
      orders: 1190,
      completion: "98%",
      rate: "93%",
      price: "0.09",
      available: "99 Gaias ",
      // limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Polkadot wallet"],
    },
    {
      id: "CryptoVara",
      orders: 1190,
      completion: "100.00%",
      rate: "98%",
      price: "0.09",
      available: "9 Gaias",
      // limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Polkadot wallet"],
    },
    {
      id: "2QUEEN",
      orders: 1190,
      completion: "92%",
      rate: "96%",
      price: "0.09",
      available: "99 Gaias",
      // limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Polkadot wallet"],
    },
    {
      id: "KinG",
      orders: 1190,
      completion: "98%",
      rate: "97%",
      price: "0.09",
      available: "99 Gaias",
      // limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Polkadot wallet"],
    },
  ];
  //usuario desde firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleButtonModal = (row: RowData) => {
    setSelectedRow(row);
  };
  useEffect(() => {
    if (selectedRow) {
      setIsModalOpen(true);
    }
  }, [selectedRow]); // Se ejecuta solo cuando `selectedRow` cambia.

  return (
    <div className="flex flex-wrap m-2">
      {rows.map((row: RowData, index) => (
        <div key={index} className="w-full bg-gray-100">
          {/* Large screens (md+) - Display rows */}

          <div className="hidden md:block border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
            <h2 className="text-lg text-gray-900 font-medium title-font mb-0 hover:cursor-pointer">
                {loggedInUser?.email || row.id}
              </h2>
              <p className="text-gray-900">
                {row.orders} orders / {row.completion} Completed
              </p>
            </div>
            <div className="flex flex-wrap text-md">
              <p className="text-gray-900 mr-4 mt-2">
                Success Rate: {row.rate}
              </p>
              {/* <p className="text-center text-emerald-500">${cryptoPrice}</p> */}
              {/* <p className="text-emerald-500 mr-4 mt-2">Price: {cryptoPrice} USDT</p> */}
              <p className="text-gray-900 mr-4 mt-2">
                Available: {row.available}
              </p>
              {/* <p className="text-gray-900 mt-2">Limit: {row.limit}</p> */}
              <p className="text-gray-900 mt-2">
                Payments: {row.paymentMethods.join(", ")}
              </p>
            </div>
            <div className="text-right mt-4">
              {" "}
              <button
                className={`text-white ${
                  mode === "Buy"
                    ? "bg-emerald-500 hover:bg-emerald-400 w-24"
                    : ""
                } focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                onClick={() => handleButtonModal(row)}
              >
                {mode === "Buy" ? "Buy" : "Sell"}
              </button>
            </div>
          </div>

          {/* Small screens (less than md) - Display cards */}
          <div className="md:hidden">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-lg text-gray-900 font-medium title-font mb-0 hover:cursor-pointer">
                {loggedInUser?.email || row.id}
              </h2>
              <p className="text-black mb-4">
                {row.orders} órdenes | {row.completion} Completado
              </p>
              <p className="text-black mb-4">{row.rate}</p>
              {/* <p className="text-emerald-500 mr-4 mt-2">Price: {cryptoPrice}</p> */}
              <p className="text-black mb-4">Disponible: {row.available}</p>
              {/* <p className="text-black mb-4">Límite: {row.limit}</p> */}
              <p className="text-black mb-4">
                Métodos de pago: {row.paymentMethods.join(", ")}
              </p>
              <div className="text-center mt-6">
                <button
                  className={`text-white ${
                    mode === "Buy"
                      ? "bg-emerald-500 hover:bg-emerald-400 w-24"
                      : "bg-red-600 hover:bg-red-500 w-24"
                  } focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                  onClick={() => handleButtonModal(row)}
                >
                  {mode === "Buy" ? "Buy" : "Sell"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <TransactionModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        rowData={selectedRow}
        mode={mode}
      />
    </div>
  );
};

export default P2PTable;
