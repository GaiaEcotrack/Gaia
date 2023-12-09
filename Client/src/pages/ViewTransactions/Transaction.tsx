import { useState, useEffect } from "react";
import { MdOutlineTrendingUp, MdOutlineTrendingDown } from "react-icons/md";
import { useSelector } from 'react-redux';
// Importaciones locales
import {CryptoCard} from "components/CryptoCard/CryptoCard";
import { CryptoCardVara } from "components/CryptoCard/CryptoCardVara";

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


  const onClose = () => {
    setSendTokenState(false);
    setConvertTokenState(false);
    setFundsState(false)
  };
  const openCard = () => {
    setSendTokenState(true);
  };
  const openCardConvert = () => {
    setConvertTokenState(true);
  };
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


  

  const porcentajeGaiaColor = porcentajesCambio.gaia > 0 ? "#00ffc3" : "red";
  const porcentajeVaraColor = porcentajesCambio.vara > 0 ? "#00ffc3" : "red";
  
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#181745] shadow-2xl w-[90%] sm:w-4/5 h-[43rem] gap-5 sm:h-56 rounded-md mt-16 flex sm:flex-row items-center flex-col sm:gap-10 sm:justify-around p-2.5">
        {/* <div className="w-80 h-44 shadow-lg sm:w-80 sm:h-48 flex flex-col  bg-gradient-to-r from-secondary to-primary rounded-md"> */}
          {/* <div className="flex gap-10 p-2.5 items-center justify-between">
            <img className="w-14 h-14" src="/LOGOGAIASOLO.png" alt="" />
            <div className="flex gap-1">
              <button
              type="button"
              onClick={openCardConvert}
                className="cursor-pointer transition-all bg-blue-500 text-white px-2 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px] "
              >
                Convertir
              </button>
              <button
              type="button"
                onClick={openCard}
                className="cursor-pointer transition-all bg-blue-500 text-white px-2 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Enviar
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-2.5">
            <div className="sm:text-3xl">Gaia</div>
            <div className="sm:text-3xl"><LocalBalanceToken/></div>
          </div>
          <div className="flex items-center gap-10">
            <h2 className="p-2.5 sm:text-2xl ">
              ${totalGaia.toFixed(2)}
            </h2>
            <div className="flex items-center gap-1">
              <h3 style={{ color: porcentajeGaiaColor }}>
                {porcentajesCambio.gaia.toFixed(2)}%
              </h3>
              {porcentajesCambio.gaia > 0 ? (
                <MdOutlineTrendingUp
                  style={{ fontSize: "2em", color: "#00ffc3" }}
                />
              ) : (
                <MdOutlineTrendingDown
                  style={{ fontSize: "2em", color: "red" }}
                />
              )}
            </div>
          </div> */}
          <CryptoCard image='/LOGOGAIASOLO.png' metric={porcentajesCambio.gaia.toFixed(2)}  quantity={totalGaia.toFixed(2)} name="Gaia" onClick={openCard} />
        {/* </div> */}

        {/* <div className="w-80 shadow-lg h-44 sm:w-80 sm:h-48 flex flex-col bg-gradient-to-r from-vara to-black rounded-md">
          <div className="flex gap-10 p-2.5 items-center justify-between">
            <img className="w-14 h-14" src="/VaraCrypto.png" alt="" />
            <div className="flex gap-1">
              <button
              type="button"
              onClick={openCardConvert}
                className="cursor-pointer transition-all bg-blue-500 text-white px-2 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px] "
              >
                Convertir
              </button>
              <button
              type="button"
                onClick={openCard}
                className="cursor-pointer transition-all bg-blue-500 text-white px-2 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
              >
                Enviar
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between p-2.5">
            <div className="sm:text-3xl"><VaraTokenName/></div>
            <h2 className="sm:text-3xl"><VarasBalance/></h2>
          </div>
          <div className="flex items-center gap-10">
            <h2 className="p-2.5 sm:text-2xl ">
              ${totalVara.toFixed(2)}
            </h2>
            <div className="flex items-center gap-1">
              <h3 style={{ color: porcentajeVaraColor }}>
                {porcentajesCambio.vara.toFixed(2)}%
              </h3>
              {porcentajesCambio.vara > 0 ? (
                <MdOutlineTrendingUp
                  style={{ fontSize: "2em", color: "#00ffc3" }}
                />
              ) : (
                <MdOutlineTrendingDown
                  style={{ fontSize: "2em", color: "red" }}
                />
              )}
            </div>
          </div>
        </div> */}
        <CryptoCardVara image="/VaraCrypto.png" quantity={totalVara.toFixed(2)} metric={porcentajesCambio.vara.toFixed(2)} name="Vara" onClick={openCard}/>

        <div className="bg-gradient-to-br from-secondary to-black  rounded-3xl border shadow-xl p-8 w-80 h-52">
          <div className="flex items-center justify-center p-2.5">
            <h2 className="sm:text-3xl">Saldo Total</h2>
          </div>
          <div className="flex items-center gap-5">
          <button type="button" onClick={openCardFunds} className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">Retirar Fondos</button>
          <button type="button" onClick={openCardFunds} className="hover:brightness-110 hover:animate-pulse font-bold py-3 px-6 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 text-white">Depositar Fondos</button>
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
    </div>
  );
};

export {Transaction}
