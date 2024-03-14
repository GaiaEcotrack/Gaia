

const P2PFilterBar: React.FC <{setMode: (mode: 'Buy' | 'Sell') => void}> = ({ setMode }) => {
    return (
      <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md">
        <div className="flex space-x-2">
          <button className="px-6 py-2 text-white bg-emerald-500 rounded hover:bg-emerald-400 focus:outline-none"
          onClick={() => setMode('Buy')}
          >Buy</button>
          <button className="px-6 py-2 text-white bg-red-600 rounded hover:bg-red-500 focus:outline-none"
          onClick={() => setMode('Sell')}
          >Sell</button>
        </div>
  
        <div className="flex space-x-2">
          {['USDT', 'BTC', 'FDUSD', 'BNB', 'ARS', 'ETH', 'DAI', 'DOGE', 'ADA', 'XRP'].map((currency: string) => (
            <button key={currency} className="px-3 py-1 text-sm text-gray-800 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">
              {currency}
            </button>
          ))}
        </div>
  
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Introduce cantidad"
            className="px-4 py-2 text-sm border rounded focus:outline-none focus:border-blue-500"
          />
          <select className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">
            <option>Varas</option>
            {/* Agrega más opciones de moneda si es necesario */}
          </select>
          <select className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">
            <option>Todos los pagos</option>
            {/* Agrega más opciones de método de pago si es necesario */}
          </select>
          <select className="px-3 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">
            <option>Todas las regiones</option>
            {/* Agrega más opciones de región si es necesario */}
          </select>
        </div>
      </div>
    );
  };
  
  export default P2PFilterBar;