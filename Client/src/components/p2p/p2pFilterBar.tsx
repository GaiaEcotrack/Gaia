import axios from "axios";
import { useEffect, useState } from "react";



const P2PFilterBar: React.FC <{setMode: (mode: 'Buy' | 'Sell') => void}> = ({ setMode }) => {

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

    return (
      <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md m-2">
        <div className=" space-x-2">
          <button className="px-6 py-2 text-white w-24 bg-emerald-500 rounded hover:bg-emerald-400 focus:outline-none"
          onClick={() => setMode('Buy')}
          >Buy</button>
          <button className="px-6 py-2 text-white w-24 bg-red-700 rounded hover:bg-red-600 focus:outline-none"
          onClick={() => setMode('Sell')}
          >Sell</button>
           <img className="mt-4" src="/VaraCrypto.png" width="42" height="42" alt="" />
          <span className="text-gray-900 text-sm mr-4 mt-2">Current Price:</span>
          <span className="text-emerald-400">{cryptoPrice} USDT</span>
        </div>
  
        <div className=" space-x-2">
          {['USDT', 'BTC', 'FDUSD', 'BNB', 'ARS'].map((currency: string) => (
            <button key={currency} className="px-3 py-1 text-sm text-gray-800 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">
              {currency}
            </button>
          ))}
        </div>
  
        <div className=" items-center space-x-2">
          <input
            type="text"
            placeholder="Quantity Kw/Gaias"
            className="px-4 py-2 text-sm text-gray-900 border rounded focus:outline-none focus:border-blue-500"
          />
          <select className="px-3 py-2 text-sm bg-gray-600 rounded hover:bg-gray-500 focus:outline-none">
            <option>Varas</option>
            {/* revisar si es necesario este campo */}
          </select>
          <select className="px-3 py-2 text-sm bg-gray-600 rounded hover:bg-gray-500 focus:outline-none">
            <option>All pays</option>
            <option value="southAmerica">Varas</option>
          </select>
          <select className="px-3 py-2 text-sm bg-gray-600 rounded hover:bg-gray-500 focus:outline-none">
            <option>All regions</option>
            <option value="southAmerica">South America</option>
            <option value="southAmerica">Colombia</option>
            
          </select>
        </div>
      </div>
    );
  };
  
  export default P2PFilterBar;