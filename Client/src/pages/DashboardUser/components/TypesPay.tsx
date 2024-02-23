import React , {useEffect} from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import MercadoPago from './MercadoPago'
import CoinbaseButton from './Coinbase'
import PaypalButton from './PaypalButton'

const TypesPay = () => {
  const userRedux = useSelector((state:RootState) => state.app.loggedInUser)
  const userId = userRedux![0]._id
  useEffect(() => {
    localStorage.setItem('idUserRedux', userId);
  }, [userId])

  console.log(localStorage.getItem('idUserRedux'))
  
  
  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <h1>Selecciona Tu Metodo de pago</h1>
        <div className='grid grid-cols-2 grid-rows-2 gap-5'>
          <MercadoPago/>
          <CoinbaseButton/>
          <PaypalButton totalValue="60" invoice="Kws"/>
        </div>
      </div>
    </div>
  )
}

export default TypesPay