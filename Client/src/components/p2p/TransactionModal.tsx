import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import axios from "axios";
import { initMercadoPago} from '@mercadopago/sdk-react'
initMercadoPago('TEST-37c724d2-e7c4-43a2-9ae5-93e83eff22fd');

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
  const [inputValue, setInputValue] = useState("0");
  const [USDAmount, setUSDAmount] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    if (kwQuantity <= 0) {
      kwQuantity = 0;
      setInputValue("0"); // Establecer el valor de entrada a 0 si la cantidad de kW es negativa
      setErrorMessage("The quantity cannot be 0");
    } else if (kwQuantity > rowData?.wallet.amount_kwh_to_sell) {
      kwQuantity = rowData?.wallet.amount_kwh_to_sell; // Establecer el valor al límite máximo
      setInputValue(kwQuantity.toString()); // Actualizar el valor del input
      setErrorMessage(`The limit is ${rowData?.wallet.amount_kwh_to_sell} kW.`);
    } else {
      setInputValue(e.target.value); // Usar el valor ingresado si es positivo y no supera el límite
      setErrorMessage(""); // Limpiar el mensaje de error si todo está bien
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

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentMethod(e.target.value);
  };

  //*************** Mercado Pago
  const url = import.meta.env.VITE_APP_API_URL

  const [prefrenceId, setPreferenceId] = useState('')

  const createPreference = async () => {
    try {
      const response = await axios.post(
        `${url}/mercadopago/crearpago`,
        {
          "title": "suscripcion",
          "quantity": 1,
          "unit_price": 60
        }
      );
      const initPoint = response.data.init_point;
      return initPoint;
    } catch (error) {
      console.log(error);
    }
  };

  const handleBuyMercdPago = async () => {
    const initPoint = await createPreference();
    if (initPoint) {
      setPreferenceId(initPoint);
      // Redireccionar al usuario al initPoint para completar el pago
      window.location.href = initPoint;
    }
  };
  //************** fin Mercado Pago

  // ******** Coinbase

  const handleBuyCoinbase = () => {
    window.location.href = "https://commerce.coinbase.com/checkout/5745368b-a198-4a09-87a9-3e1e38ff2fce";
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
        <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
          {/* Contenido del modal */}
          <div className="flex justify-between items-start">

            <div className="flex flex-col w-[50%]">

              <div className="p-4 m-2 border-2 h-52">
                <h3 className="text-lg font-semibold text-gray-900 m-2">
                  {rowData.full_name ? rowData.full_name : rowData.email.split("@")[0]}
                </h3>
                <p className="text-gray-900 m-2">Orders Placed: {rowData?.orders}</p>
                <p className="text-gray-900 m-2">Completed Orders: {rowData?.completion}</p>
                <p className="text-gray-900 m-2">Success: {rowData?.rate}</p>
                <p className="text-gray-900 m-2">Price: $0.645 USD / kW</p>
              </div>

              <div className="text-center px-4 pb-8 m-2 border-2">
                <p className="text-gray-900 m-2">Select a payment method{" "}
                  <select name="" id="" className="border rounded-lg px-3 mt-2 h-8" onChange={handlePaymentMethodChange}>
                    <option value="">Select one</option>
                    <option value="mercadoPago">Mercado Pago </option>
                    <option value="coinbase">Coinbase (Crypto)</option>
                  </select>                
                </p>
              </div>

            </div>

            <div className="flex flex-col w-[50%]">

              <div className="p-4 m-2 border-2 h-52">
                <label
                  htmlFor="amount"
                  className="block text-gray-900 text-[17px] font-black my-2"
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
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-[35%] h-8 pl-3 pr-2 sm:text-lg font-semibold text-gray-900 border border-gray-600 rounded-md shadow-sm"
                    placeholder="0"
                  />
                  {errorMessage && <p className="text-red-500 text-xs absolute">{errorMessage}</p>}
                </div>
                  <p className="text-gray-900 m-2 ml-0 pt-1">Limit: {rowData.wallet.amount_kwh_to_sell} kW</p>
                <div className="mt-4">
                  <p className="text-gray-900">
                    The cost in USD will be: <span className="font-semibold">$ {USDAmount.toFixed(2)}</span>
                  </p>
                  <p className="text-gray-900">
                    The cost in COP will be: <span className="font-semibold">$ {formattedCOP}</span>
                  </p>
                </div>              
              </div>

              <div className="flex items-end justify-end h-[108px] mr-3">
                <button
                  onClick={closeModal}
                  className="w-20 bg-gray-200 hover:bg-gray-300 rounded text-black px-4 py-2"
                >
                  Close
                </button>
                <button
                  onClick={paymentMethod === "mercadoPago" ? handleBuyMercdPago : handleBuyCoinbase}
                  className={`w-20 ml-2 px-4 py-2 rounded text-white ${
                    inputValue === "0" || !paymentMethod ? "bg-green-200 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={inputValue === "0" || !paymentMethod}
                  >
                  Buy
                </button>
              </div>

            </div>   

          </div>         
        </div>
      </div>
      )}

      {/* {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full">          
          <div className="relative top-20 mx-auto p-5 border w-[50%] shadow-lg rounded-md bg-white">
            
            <h1 className="text-black">Metodos de pago</h1>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleBuyCoinbase}
                className="bg-gray-200 hover:bg-gray-300 rounded text-black px-4 py-2"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )} */}

    </>
  );
};

export default TransactionModal;

//! 1 kw 0,2 == gaias
//! 10  varas == 0.8 usdt (aprox al dia de hoy)
//! para saber cuanto puedo comprar con 10 varas:
//! 0.8 usdt / 0,2 gaias == 4kw
