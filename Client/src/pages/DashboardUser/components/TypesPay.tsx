import React from 'react'
import MercadoPago from './MercadoPago'
import CoinbaseButton from './Coinbase'
import PaypalButton from './PaypalButton'

const TypesPay = () => {
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