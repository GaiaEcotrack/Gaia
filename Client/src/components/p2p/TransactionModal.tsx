import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";


interface RowData {
  email: any;
  full_name: any;
  id: string;
  orders: number;
  completion: string;
  rate: string;
  price: string;
  available: string;
  limit: string;
  paymentMethods: PaymentMethodData[];
  wallet: any;
  amount_kwh_to_sell: number;
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
  const [USDAmount, setUSDAmount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // precio de USD en pesos Colombianos al dia
  const [conversionCOP, setConversionCOP] = useState<number>(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_APP_API_URL;
        const { data } = await axios.get(`${URL}/coinbase`);
        const USDPrice = data.usdt.price.data.amount;
        setConversionCOP(USDPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  },[]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let kwQuantity = parseFloat(e.target.value); // Cantidad de kW ingresada por el usuario

    // Verificar y corregir el valor si es negativo
    if (kwQuantity < 0) {
      kwQuantity = 0;
      setInputValue("0"); // Establecer el valor de entrada a 0 si la cantidad de kW es negativa
    } else if (kwQuantity > rowData?.wallet.amount_kwh_to_sell) {
      kwQuantity = rowData?.wallet.amount_kwh_to_sell; // Establecer el valor al límite máximo
      setInputValue(kwQuantity.toString()); // Actualizar el valor del input
    } else {
      setInputValue(e.target.value); // Usar el valor ingresado si es positivo y no supera el límite
    }
    // Calcular la cantidad de USD equivalentes al costo en kW
    const USDQuantity = kwQuantity * 0.645; // Dividir la cantidad de kW por 0.0687 para obtener las USD equivalentes
    setUSDAmount(USDQuantity); // setUSDAmount ahora tiene el número de varas equivalentes al costo en kW
  };

  const COPAmount = USDAmount * conversionCOP
  const formattedCOP = COPAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  //usuario desde firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleBuyClick = () => {
    // Aquí podrías agregar lógica adicional antes de mostrar el nuevo modal, si es necesario
    setShowNewModal(!showNewModal); // Cambia el estado para mostrar el nuevo modal
  };

  if (!isOpen || !rowData) return null;

  return (
    <>
      {!showNewModal && (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full ${
          !isOpen && "hidden"
        }`}
      >
        <div className="relative top-20 mx-auto p-5 border w-[60%] shadow-lg rounded-md bg-white">
          {/* Contenido del modal */}
          <div className="flex justify-between items-center">
            <div className="p-4 m-2 border-2">
              <h3 className="text-lg font-semibold text-gray-900 m-2">
                {rowData.full_name ? rowData.full_name : rowData.email.split("@")[0]}
              </h3>
              <p className="text-gray-900 m-2">{`${rowData?.orders} órdenes | ${rowData?.completion} Completado`}</p>
              <p className="text-gray-900 m-2">Success: {rowData?.rate}</p>
              <p className="text-gray-900 m-2">Price: $0.645 USD / kW</p>
              <p className="text-gray-900 m-2">Limit: {rowData.wallet.amount_kwh_to_sell} kW</p>
              <div>
                <p className="text-gray-900 m-2">Payment method:{" "}
                  <select name="" id="" className="border rounded-lg px-3">
                    <option value="">Seleccione Una</option>
                    <option value="">Mercado Pago</option>
                    <option value="">PSE</option>
                    <option value="">Bancolombia</option>
                  </select>                
                </p>
              </div>
            </div>
            <div className="p-4 m-2 border-2 w-[50%]">
              <label
                htmlFor="amount"
                className="block text-gray-900 text-[17px] font-black"
              >
                How many kW do you want to buy ?
              </label>
              <div className="mt-1 relative">
                <input
                  type="number"
                  name="amount"
                  id="amount"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-[70%] h-8 pl-3 pr-2 sm:text-sm text-gray-900 border border-gray-600 rounded-md shadow-sm"
                  placeholder="0"
                />
              </div>
              <div className="mt-4">
                <p className="text-gray-900">
                  The cost in USD will be: $ {USDAmount.toFixed(2)}
                </p>
                <p className="text-gray-900">
                  The cost in COP will be: $ {formattedCOP}
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
              onClick={handleBuyClick}
              className={`ml-2 px-4 py-2 rounded text-white bg-green-500 hover:bg-green-600`}
              >
              Continue
            </button>
          </div>
        </div>
      </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full">          
          <div className="relative top-20 mx-auto p-5 border w-[50%] shadow-lg rounded-md bg-white">
            
            <h1 className="text-black">Metodos de pago</h1>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleBuyClick}
                className="bg-gray-200 hover:bg-gray-300 rounded text-black px-4 py-2"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
};

export default TransactionModal;

//! 1 kw 0,2 == gaias
//! 10  varas == 0.8 usdt (aprox al dia de hoy)
//! para saber cuanto puedo comprar con 10 varas:
//! 0.8 usdt / 0,2 gaias == 4kw
