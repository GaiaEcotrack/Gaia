import { NameFungibleToken } from "pages/home/NameToken";
import { MdOutlineTrendingUp, MdOutlineTrendingDown } from "react-icons/md";
import { useState, useEffect } from "react";
import { ModalSendToken } from "../ModalTransaction/ModalSendToken";
import { ModalConvertTokens } from "../ModalTransaction/ModalConvertTokens";
import { ModalFunds } from "../ModalTransaction/ModalFunds";
import { LocalBalanceToken } from "pages/home/MyBalanceToken";
import { VaraTokenName } from "pages/home/VaraNameToken";
import { VarasBalance } from "pages/home/VarasBalance";


interface CryptoValues {
  gaia: number;
  vara: number;
}

interface PercentageChanges {
  gaia: number;
  vara: number;
}

function Transaction () {



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

  
  const [valoresCrypto, setValoresCrypto] = useState<CryptoValues>({
    gaia: 1256,
    vara: 2300,
  });

  const [porcentajesCambio, setPorcentajesCambio] = useState<PercentageChanges>(
    {
      gaia: 0,
      vara: 0,
    }
  );

  const [total, setTotal] = useState<number>(
    valoresCrypto.gaia + valoresCrypto.vara
  );

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
      setTotal(
        (prevTotal) =>
          prevTotal +
          valoresCrypto.gaia * (nuevosPorcentajes.gaia / 100) +
          valoresCrypto.vara * (nuevosPorcentajes.vara / 100)
      );
    }, 3000);

    return () => clearInterval(intervalId);
  }, [valoresCrypto.gaia, valoresCrypto.vara]);

  const porcentajeGaiaColor = porcentajesCambio.gaia > 0 ? "#00ffc3" : "red";
  const porcentajeVaraColor = porcentajesCambio.vara > 0 ? "#00ffc3" : "red";

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white w-4/5 h-56 rounded-md mt-10 flex items-center gap-10 justify-around p-2.5">
        <div className="w-80 h-48 flex flex-col bg-gradient-to-r from-secondary to-primary rounded-md">
          <div className="flex gap-10 p-2.5 items-center justify-between">
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
            <div className="text-3xl"><NameFungibleToken/></div>
            <div><LocalBalanceToken/></div>
          </div>
          <div className="flex items-center gap-10">
            <h2 className="p-2.5 text-2xl ">
              ${valoresCrypto.gaia.toFixed(2)}
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
          </div>
        </div>

        <div className="w-80 h-48 flex flex-col bg-gradient-to-r from-vara to-black rounded-md">
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
            <div className="text-3xl"><VaraTokenName/></div>
            <h2 className="text-3xl"><VarasBalance/></h2>
          </div>
          <div className="flex items-center gap-10">
            <h2 className="p-2.5 text-2xl ">
              ${valoresCrypto.vara.toFixed(2)}
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
        </div>

        <div className="w-80 h-48 bg-gradient-to-r from-black to-secundary flex flex-col items-center justify-around gap-5 bg-secondary rounded-md">
          <div className="flex items-center justify-center p-2.5">
            <h2 className="text-3xl">Saldo Total</h2>
          </div>
          <div className="flex items-center gap-5">
            <button
            type="button"
            onClick={openCardFunds}
              className="cursor-pointer transition-all bg-blue-500 text-white px-2 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px] "
            >
              Retirar Fondos
            </button>
            <button
            type="button"
              className="cursor-pointer transition-all bg-blue-500 text-white px-2 py-2 rounded-lg
border-blue-600
border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
            >
              Depositar Fondos
            </button>
          </div>
          <h2 className="p-2.5 text-3xl ">${total.toFixed(2)} USD</h2>
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
