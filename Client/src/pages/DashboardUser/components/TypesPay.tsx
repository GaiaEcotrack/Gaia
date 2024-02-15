import React from 'react'
import MercadoPago from './MercadoPago'
import CoinbaseButton from './Coinbase'

const TypesPay = () => {
  return (
    <div>
      <div>
        <h1>Selecciona Tu Metodo de pago</h1>
        <div>
          <MercadoPago/>
          <CoinbaseButton/>
        </div>
      </div>
    </div>
  )
}

export default TypesPay