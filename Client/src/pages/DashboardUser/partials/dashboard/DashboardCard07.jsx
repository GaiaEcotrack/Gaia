import React ,{useState, useEffect}  from 'react';
import axios from 'axios'

function DashboardCard07() {
  const [cryptoPrice, setCryptoPrice] = useState("")

  useEffect(() => {
    const fetchData = async ()=>{
      try {
        const URL = import.meta.env.VITE_APP_API_URL
        const request = await axios.get(`${URL}/coinbase`)
        const response = request.data
        setCryptoPrice(response)
      } catch (error) {
        
      }
    }
    fetchData()
  },[])
  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Market</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Crypto</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Vol</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Price</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Approximate users</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Conversion</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center gap-5">
                    <img src="/LogoGaia.svg" width="36" height="36" alt="" />
                    <div className="text-slate-800 dark:text-slate-100">Gaia</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">2.4B</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">$0,037</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">500k</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">4.7%</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center gap-5">
                  <img src="/bitcoin-logo-svgrepo-com.svg" width="36" height="36" alt="" />
                    <div className="text-slate-800 dark:text-slate-100">Bitcoin</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">{parseFloat(cryptoPrice.btc?.vol).toFixed(1)}M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">${cryptoPrice.btc?.price?.data?.amount}</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">320M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">4.4%</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center gap-5">
                  <img src="/ethereum-eth-logo.svg" width="32" height="32" alt="" />
                    <div className="text-slate-800 dark:text-slate-100">Ethereum</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">{parseFloat(cryptoPrice.eth?.vol).toFixed(1)}M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">${cryptoPrice.eth?.price?.data?.amount}</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">50M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">4.2%</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center gap-5">
                  <img src="/polkadot-new-dot-logo.svg" width="36" height="36" alt="" />
                    <div className="text-slate-800 dark:text-slate-100">Polkadot</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">{parseFloat(cryptoPrice.dot?.vol).toFixed(1)}M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">${cryptoPrice.dot?.price?.data?.amount}</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">11M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">4.2%</div>
                </td>
              </tr>
              {/* Row */}
              <tr>
                <td className="p-2">
                  <div className="flex items-center gap-5">
                  <img src="/VaraCrypto.png" width="36" height="36" alt="" />
                    <div className="text-slate-800 dark:text-slate-100">Vara</div>
                  </div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">{parseFloat(cryptoPrice.vara?.vol).toFixed(1)}M</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-emerald-500">${cryptoPrice.vara?.price?.data?.amount}</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-black">800K</div>
                </td>
                <td className="p-2">
                  <div className="text-center text-sky-500">3.9%</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
