import { useState, useEffect } from "react";
import { useAccount} from "@gear-js/react-hooks";
import { useSelector } from 'react-redux';
// Importaciones locales
import {CryptoCard} from "../../components/CryptoCard/CryptoCard";
import { CryptoCardVara } from "../../components/CryptoCard/CryptoCardVara";
import {AlertModal} from "../../components/AlertModal/AlertModal";

import { ModalSendToken } from "../ModalTransaction/ModalSendToken";
import { ModalConvertTokens } from "../ModalTransaction/ModalConvertTokens";
import { ModalFunds } from "../ModalTransaction/ModalFunds";
import { RootState } from '../../store/index';


interface CryptoValues {
  gaia: any;
  vara: any;
}

interface PercentageChanges {
  gaia: number;
  vara: number;
}

function Transaction () {


  const gaia = useSelector((state: RootState)=> state.app.valueGaia)
  const vara = useSelector((state: RootState)=> state.app.valueVara)

  // Función para calcular el valor total
  

  const [cantidad, setCantidad] = useState({
    gaia,
    vara,
  });

  const calcularValorTotal = (quantity: number, valorCrypto: number): number =>
  quantity * valorCrypto;

  const [valoresCrypto, setValoresCrypto] = useState<CryptoValues>({
    gaia: 0.126,
    vara: 50.50,
  });
  
  const totalGaia = calcularValorTotal(cantidad.gaia, valoresCrypto.gaia);
  const totalVara = calcularValorTotal(cantidad.vara, valoresCrypto.vara);
  
  const [sendTokenState, setSendTokenState] = useState(false);
  const [convertTokenState, setConvertTokenState] = useState(false);
  const [fundsState, setFundsState] = useState(false)
  const [alert, setAlert] = useState(false)

  const {account } = useAccount();
  const addresLocal = account?.address

  const onClose = () => {
    setSendTokenState(false);
    setConvertTokenState(false);
    setFundsState(false)
    setAlert(false)
  };
  const openCard = () => {
    if(addresLocal !== undefined){
      setSendTokenState(true);
    }
    else{
      setAlert(true)    
    }
  };
  // const openCardConvert = () => {
  //   setConvertTokenState(true);
  // };
  const openCardFunds = () => {
    setFundsState(true);
  };

  const [porcentajesCambio, setPorcentajesCambio] = useState<PercentageChanges>(
    {
      gaia: 0,
      vara: 0,
    }
  );
  const totalTokens = totalGaia + totalVara

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulamos cambios aleatorios en los porcentajes
      const nuevosPorcentajes: PercentageChanges = {
        gaia: Math.random() * 2 - 1,
        vara: Math.random() * 2 - 1,
      };

      setPorcentajesCambio(nuevosPorcentajes);

      // Actualizamos los valores de las criptomonedas acumulando los cambios
      setValoresCrypto((prevValores) => ({
        gaia: prevValores.gaia * (1 + nuevosPorcentajes.gaia / 100),
        vara: prevValores.vara * (1 + nuevosPorcentajes.vara / 100),
      }));

      // Calculamos el nuevo total
    }, 3000);

    return () => clearInterval(intervalId);
  }, [valoresCrypto.gaia, valoresCrypto.vara]);
  useEffect(() => {
    setCantidad((prevValores) => ({
      ...prevValores,
      gaia,
      vara,
    }));
  }, [gaia, vara]);


  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white shadow-2xl w-[90%] sm:w-4/5 h-[43rem] gap-5 sm:h-56 rounded-md mt-16 md:mt-10 flex sm:flex-row items-center flex-col sm:gap-10 sm:justify-around p-2.5">
        <CryptoCard image='/LOGOGAIASOLO.png' metric={porcentajesCambio.gaia.toFixed(2)}  quantity={totalGaia.toFixed(2)} name="Gaia" onClick={openCard} />
        <CryptoCardVara image="/VaraCrypto.png" quantity={totalVara.toFixed(2)} metric={porcentajesCambio.vara.toFixed(2)} name="Vara" onClick={openCard}/>

        <div className="bg-gradient-to-br from-secondary to-black  rounded-3xl border shadow-xl p-8 w-80 h-52">
          <div className="flex items-center justify-center p-2.5">
            <h2 className="sm:text-3xl">Total Balance</h2>
          </div>
          <div className="flex items-center gap-5">
          <button type="button" onClick={openCardFunds} className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">Withdraw funds</button>
          <button type="button" onClick={openCardFunds} className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">Deposit funds</button>
          </div>
          <h2 className="p-2.5 sm:text-3xl ">${totalTokens.toFixed(2)} USD</h2>
        </div>
      </div>
      {sendTokenState && (
        <div>
          <ModalSendToken onClose={onClose} />
        </div>
      )}
      {convertTokenState && (
        <div>
          <div>
            <ModalConvertTokens onClose={onClose} />
          </div>
        </div>
      )}
      {fundsState && (
              <div>
              <ModalFunds onClose={onClose}/>
            </div>
      )}
      {alert && (
        <div>
          <AlertModal onClose={onClose}/>
        </div>
      )}
    </div>
  );
};

export {Transaction}
