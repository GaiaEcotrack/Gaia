import React from 'react'
import MercadoPago from './MercadoPago'
import CoinbaseButton from './Coinbase'
import PaypalButton from './PaypalButton'

const TypesPay = () => {
  return (
    <div>
      <div>
        <h1>Selecciona Tu Metodo de pago</h1>
        <div>
          <MercadoPago/>
          <CoinbaseButton/>
          <PaypalButton totalValue="4.99" invoice="Kws"/>
        </div>
      </div>
    </div>
  )
}

export default TypesPay