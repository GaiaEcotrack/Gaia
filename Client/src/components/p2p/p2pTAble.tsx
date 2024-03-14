type PaymentMethod = "Lemon Cash" | "Mercadopago";

interface RowData {
  id: string;
  orders: number;
  completion: string;
  rate: string;
  price: string;
  available: string;
  limit: string;
  paymentMethods: PaymentMethod[];
}

interface P2PTableProps {
  mode: "Buy" | "Sell";
}
const P2PTable: React.FC<P2PTableProps> = ({ mode }) => {
  const rows: RowData[] = [
    {
      id: "User1",
      orders: 1190,
      completion: "100.00%",
      rate: "99%",
      price: "1,049.80 ARS",
      available: "99.84 USDT",
      limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Lemon Cash", "Mercadopago"],
    },
    {
      id: "xUser",
      orders: 1190,
      completion: "98%",
      rate: "93%",
      price: "1,049.80 ARS",
      available: "99.84 USDT",
      limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Lemon Cash", "Mercadopago"],
    },
    {
      id: "CryptoVara",
      orders: 1190,
      completion: "100.00%",
      rate: "98%",
      price: "1,049.80 ARS",
      available: "99.84 USDT",
      limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Lemon Cash", "Mercadopago"],
    },
    {
      id: "2QUEEN",
      orders: 1190,
      completion: "92%",
      rate: "96%",
      price: "1,049.80 ARS",
      available: "99.84 USDT",
      limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Lemon Cash", "Mercadopago"],
    },
    {
      id: "KinG",
      orders: 1190,
      completion: "98%",
      rate: "97%",
      price: "1,049.80 ARS",
      available: "99.84 USDT",
      limit: "ARS50,000.00 - ARS104,812.30",
      paymentMethods: ["Lemon Cash", "Mercadopago"],
    },
  ];

  return (
    <div className="p-24">
      {/* Tabla visible solo en pantallas grandes */}
      <div className="hidden sm:block">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">User</th>
              <th className="py-3 px-6 text-left">Orders / Completed</th>
              <th className="py-3 px-6 text-left">Success orders</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-center">Available / Limit</th>
              <th className="py-3 px-6 text-center">Payments type</th>
              <th className="py-3 px-6 text-center">Operation</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="items-center">
                    <span className="font-medium">{row.id}</span>
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  {row.orders} órdenes / {row.completion}
                </td>
                <td className="py-3 px-6 text-left">{row.rate}</td>
                <td className="py-3 px-6 text-left">{row.price}</td>
                <td className="py-3 px-6 text-center">
                  {row.available} / {row.limit}
                </td>
                <td className="py-3 px-6 text-center">
                  {row.paymentMethods.join(" / ")}
                </td>
                <td className="py-3 px-6 text-center">
                  <button
                    className={`${
                      mode === "Buy"
                        ? "bg-emerald-500 hover:bg-emerald-400"
                        : "bg-red-600 hover:bg-red-500"
                    } text-white py-2 px-4 rounded focus:outline-none`}
                  >
                    {mode === "Buy" ? "Comprar Vara" : "Vender Vara"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas visibles solo en pantallas pequeñas */}
      <div className="sm:hidden">
        {rows.map((row, index) => (
          <div key={index} className="bg-white mb-4 p-4 rounded shadow">
            <div className="font-bold">User: {row.id}</div>
            <div>Orders / Completed: {row.orders} / {row.completion}</div>
            <div>Success orders: {row.rate}</div>
            <div>Price: {row.price}</div>
            <div>Available / Limit: {row.available} / {row.limit}</div>
            <div>Payments type: {row.paymentMethods.join(" / ")}</div>
            <button
              className={`${
                mode === "Buy"
                  ? "bg-emerald-500 hover:bg-emerald-400"
                  : "bg-red-600 hover:bg-red-500"
              } text-white py-2 px-4 rounded focus:outline-none mt-4`}
            >
              {mode === "Buy" ? "Comprar" : "Vender"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default P2PTable;
