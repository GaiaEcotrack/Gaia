import { useEffect, useState   } from "react";
import { auth } from "../../firebase"; 
import { onAuthStateChanged, User } from "firebase/auth";


interface ConfirmSellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const SellConfirmModal: React.FC<ConfirmSellModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

    

//usuario desde firebase
     useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoggedInUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;
        
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
  <div className="relative p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
    <h3 className="text-lg md:text-xl text-center text-gray-900 font-semibold title-font mb-2 hover:cursor-pointer">
      Welcome,{" "}
      <span className="text-blue-500">{loggedInUser?.email}</span>
    </h3>
    <h2 className="text-md md:text-lg font-semibold text-center text-gray-900 mb-4">Do you want to be part of p2p commerce?</h2>

    <div className="mt-5 flex justify-center space-x-4">
      <button
        className="transition duration-150 ease-in-out bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
        onClick={onConfirm}
      >
        Yes
      </button>
      <button
        className="transition duration-150 ease-in-out bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
        onClick={onClose}
      >
        No
      </button>
    </div>
  </div>
</div>
    );
  };

export default SellConfirmModal