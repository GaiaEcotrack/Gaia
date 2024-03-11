import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MercadoPago from './MercadoPago';
import CoinbaseButton from './Coinbase';
import PaypalButton from './PaypalButton';
import { getAuth } from 'firebase/auth';

const TypesPay = () => {
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const auth = getAuth();
  const user = auth.currentUser?.email;
  const userFind = userRedux.find(function (usuario) {
    return usuario.email === user;
  });

  useEffect(() => {
    if (userFind) { // Verificar si userFind no es null
      localStorage.setItem('idUserRedux', userFind._id);
    }
  }, [userFind]); // Dependencia del useEffect

  console.log(localStorage.getItem('idUserRedux'));

  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <h1>Selecciona Tu Metodo de pago</h1>
        <div className='grid grid-cols-2 grid-rows-2 gap-5'>
          <MercadoPago />
          <CoinbaseButton />
          <PaypalButton totalValue="60" invoice="Kws" />
        </div>
      </div>
    </div>
  );
};

export default TypesPay;
