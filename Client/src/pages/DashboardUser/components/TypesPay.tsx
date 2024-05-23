import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MercadoPago from './MercadoPago';
import CoinbaseButton from './Coinbase';
import { getAuth } from 'firebase/auth';

const TypesPay = () => {
  const userRedux = useSelector((state: RootState) => state.app.loggedInUser);
  const auth = getAuth();
  const user = auth.currentUser?.email;
  const userFind = userRedux ? userRedux.find(usuario => usuario.email === user) : null;

  useEffect(() => {
    if (userFind) { // Verificar si userFind no es null
      localStorage.setItem('idUserRedux', userFind._id);
    }
  }, [userFind]); // Dependencia del useEffect


  return (
    <div>
      <div className='flex flex-col items-center justify-center'>
        <h1>Selecciona Tu Metodo de pago</h1>
        <div className='grid grid-cols-2 grid-rows-2 gap-5'>
          <MercadoPago />
          <CoinbaseButton />

        </div>
      </div>
    </div>
  );
};

export default TypesPay;
