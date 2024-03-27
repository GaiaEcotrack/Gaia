import axios from "axios";
import { useEffect, useState } from "react";
import SellConfirmModal from "./sellConfirmModal";



const P2PFilterBar: React.FC<{setMode: (mode: 'Buy' | 'Sell') => void}> = ({ setMode }) => {
  const [cryptoPrice, setCryptoPrice] = useState("");
  const [isSellConfirmModalOpen, setIsSellConfirmModalOpen] = useState(false); // Mueve el estado aquí


  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_APP_API_URL;
        const { data } = await axios.get(`${URL}/coinbase`);
        const varaPrice = data.vara.price.data.amount;
        console.log(varaPrice);
        setCryptoPrice(varaPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  },[]);



  const handleSellClick = () => {
    setIsSellConfirmModalOpen(true); // Abre el modal de confirmación cuando se hace clic en "Sell"
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md m-2">
      <div className="space-x-2">
        <button
          className="px-6 py-2 text-white w-24 bg-emerald-500 rounded hover:bg-emerald-400 focus:outline-none"
          onClick={() => setMode('Buy')}
        >
          Buy
        </button>
        <button
          className="px-6 py-2 text-white w-24 bg-red-700 rounded hover:bg-red-600 focus:outline-none"
          onClick={handleSellClick} // Usa la función handleSellClick aquí
        >
          Sell
        </button>
        <img className="mt-4" src="/VaraCrypto.png" width="42" height="42" alt="" />
        <span className="text-gray-900 text-sm mr-4 mt-2">Current Price:</span>
        <span className="text-emerald-400">{cryptoPrice} USDT</span>
      </div>
      {/* Otros elementos del componente */}

      {/* Aquí se incluye SellConfirmModal */}
      <SellConfirmModal
        isOpen={isSellConfirmModalOpen}
        onClose={() => setIsSellConfirmModalOpen(false)}
        onConfirm={() => {
          // Aquí manejas la confirmación de la venta
          alert("Welcome to Gaia community!");
          setIsSellConfirmModalOpen(false);
          // Aquí podrías llamar a setMode('Sell') o manejar la venta de otra manera
        }}
      />
    </div>
  );
};

export default P2PFilterBar;
