import React , {useState} from 'react'
import axios from 'axios'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
initMercadoPago('TEST-37c724d2-e7c4-43a2-9ae5-93e83eff22fd');



const MercadoPago = () => {
  const [prefrenceId, setPreferenceId] = useState('')
    const createPreference = async () => {
        try {
          const response = await axios.post(
            `http://127.0.0.1:5000/mercadopago/crearpago`,
            {
              "title": "suscripcion",
              "quantity": 1,
              "unit_price": 1000
            }
          );
          const initPoint = response.data.init_point;
          return initPoint;
        } catch (error) {
          console.log(error);
        }
      };
    
      const handleBuy = async () => {
        const initPoint = await createPreference();
        if (initPoint) {
          setPreferenceId(initPoint);
          // Redireccionar al usuario al initPoint para completar el pago
          window.location.href = initPoint;
        }
      };
  return (
    <div>
        <button className='bg-white w-44 flex items-center justify-center h-14 rounded-full ' onClick={handleBuy}>
          <img src="/mercadopago.svg" className='w-32' alt="" />
        </button>

    </div>
  )
}

export default MercadoPago