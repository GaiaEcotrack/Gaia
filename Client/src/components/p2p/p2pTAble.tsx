import { useState, useEffect } from "react";
import TransactionModal from "./TransactionModal";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";




// interface RowData {
//   id: string;
//   orders: number;
//   completion: string;
//   rate: string;
//   price: string;
//   available: string;
//   // limit: string;
//   paymentMethods: PaymentMethod[];
// }

interface P2PTableProps {
  mode: "Buy" | "Sell";
}

const P2PTable: React.FC<P2PTableProps> = ({ mode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [users, setUsers] = useState([]);

  interface Transaction {
    date: string;
    id: string;
    receiver_user_id: string;
    sender_user_id: string;
    status: string;
    transaction_type: string;
    vara_amount: number;
  }

  interface Wallet {
    gaia_token_balance: number;
    transactions: Transaction[];
    willing_to_sell_excess: boolean;
    amount_kwh_to_sell: number;
  }

  interface User {
    _id: string;
    photo_profile: string;
    email: string;
    full_name: string | null;
    wallet: Wallet;
    id: string;
    orders: number;
    completion: string;
    rate: string;
    price: string;
    available: string;
    limit: string;
    paymentMethods: PaymentMethodData[];
    amount_kwh_to_sell: number;
    // Agrega otros campos que necesites.
  }

  //usuario desde firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser:any) => {
      setLoggedInUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);

  const handleButtonModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const url = import.meta.env.VITE_APP_API_URL;
        const response = await axios.get(`${url}/users`);
        console.log(response);
        if (response.data && response.data.users) {
          // Filtrar solo usuarios que están dispuestos a vender excedentes
          const filteredUsers = response.data.users.filter((user: User) => 
            user.wallet && 
            user.wallet.willing_to_sell_excess && 
            user.email !== loggedInUser?.email
          );
          setUsers(filteredUsers);
        } else {
          console.error("No se pudieron recuperar los usuarios");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [loggedInUser]);


  return (
    <div className="flex flex-wrap m-2" style={{ backgroundImage: "url('ruta_de_la_imagen')" }}>
      {users.map((user: User, index) => (
        <div key={user._id} className="w-full bg-gray-100">
          <div className="hidden md:block border-b-2 border-gray-300 p-8">

            <div className="flex flex-row">

              <div className="flex justify-center items-start w-16 ">
                <img 
                  src={user.photo_profile ? user.photo_profile : "https://api.multiavatar.com/c6c7f124c574a60dd2.png?apikey=CRrgM6wP8NoyEx"} 
                  alt="imagen" 
                  className="h-8 w-8 rounded-full" 
                />             
              </div>

              <div className="w-[73%] pt-1">
                <h2 className="text-lg text-gray-900 font-medium title-font mb-0 hover:cursor-pointer">
                  User: {" "}
                  {user.full_name ? user.full_name : user.email.split("@")[0]}
                </h2>
                <p className="text-gray-700">
                  Email:{" "}
                  {user.email}
                </p>
                <p className="text-gray-700">
                Kw to sell : {" "} {user.wallet && user.wallet.willing_to_sell_excess ? user.wallet.amount_kwh_to_sell : "N/A"} kw
                </p>
              </div>

              <div className="flex justify-end items-center w-[20%]">
                <button
                  className={`text-white h-12 ${
                    mode === "Buy"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-red-600 hover:bg-red-500"
                  } w-24 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5`}
                  onClick={() => handleButtonModal(user)}
                >
                  {mode === "Buy" ? "Buy" : "Sell"}
                </button>
              </div>

            </div>

            {/* <p className="text-gray-900">Gaia Token Balance: {user.wallet.gaia_token_balance}</p> */}
            {/* <div>
              <h3 className="text-gray-900">Transactions:</h3>
             
              {user.wallet?.transactions
                ?.slice(-1)
                .map((transaction, index) => (
                  <div key={index} className="text-gray-700">
                    <p>Transaction ID: {transaction.id}</p>
                    <p>Amount: {transaction.vara_amount} varas</p>
                    <p>Type: {transaction.transaction_type}</p>
                  </div>
                ))}
            </div> */}
            {/* Botón para Buy/Sell según corresponda */}
          </div>
        </div>
      ))}
      {/* Coloca el modal fuera del map para que solo tengas uno en todo el componente */}
      {selectedUser && (
        <TransactionModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          rowData={selectedUser} // Suponiendo que tu modal maneja esta prop para mostrar la data
          mode={mode}
        />
      )}
    </div>
  );
};

export default P2PTable;
