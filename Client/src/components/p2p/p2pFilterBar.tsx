import axios from "axios";
import { useEffect, useState } from "react";
import SellConfirmModal from "./SellConfirmModal";
import { auth } from "../../firebase";
import { onAuthStateChanged, User } from "firebase/auth";


const P2PFilterBar: React.FC<{setMode: (mode: 'Buy' | 'Sell') => void}> = ({ setMode }) => {
  const [conversionCOP, setConversionCOP] = useState<number>(0);
  const [isSellConfirmModalOpen, setIsSellConfirmModalOpen] = useState(false); // Mueve el estado aquí
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [totalExcedente, setTotalExcedente] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_APP_API_URL;
        const { data } = await axios.get(`${URL}/coinbase`);
        const USDPrice = parseFloat(data.usdt.price.data.amount);
        setConversionCOP(USDPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  },[]);

  const formattedCOP = conversionCOP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  //usuario desde firebase
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
     //traer los kw del localStorage
     const storedTotalExcedente = JSON.parse(localStorage.getItem("totalExcedente") || "0")
     setTotalExcedente(storedTotalExcedente);
    //  console.log("total excedente", storedTotalExcedente);
  }, [])

  const handleSellClick = () => {
    setIsSellConfirmModalOpen(true); // Abre el modal de confirmación cuando se hace clic en "Sell"
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md m-2">
      <div className="space-x-2">
        <button
          className="px-6 py-2 text-white w-24 bg-green-500 rounded hover:bg-green-600 focus:outline-none"
          onClick={() => setMode('Buy')}
        >
          Buy
        </button>
        <button
          className="px-6 py-2 text-white w-24 bg-red-700 rounded hover:bg-red-600 focus:outline-none"
          onClick={handleSellClick} 
        >
          Sell
        </button>
        <img className="mt-4" src="/VaraCrypto.png" width="42" height="42" alt="" />
        <span className="text-gray-900 text-sm mr-4 mt-2">Current selling price of USD:</span>
        <span className="text-emerald-400">{formattedCOP} COP</span> <br/>
        <span className="text-gray-900">Hello</span>
        <span className="text-gray-900">{loggedInUser?.displayName ? loggedInUser.displayName : loggedInUser?.email?.split("@")[0]} </span> <br/>
        <span className="text-gray-900"> Kw available (excedent): {totalExcedente.toFixed(5)} </span>
      </div>

      {/* Aquí se incluye SellConfirmModal */}
      <SellConfirmModal
        isOpen={isSellConfirmModalOpen}
        onClose={() => setIsSellConfirmModalOpen(false)}
        onConfirm={() => {
          // Aquí manejas la confirmación de la venta
          alert("Welcome to Gaia community!");
          setIsSellConfirmModalOpen(false);
        }}
        maxAvailableKwh={totalExcedente}
      />
    </div>
  );
};

export default P2PFilterBar;
