import React, { useState,useEffect } from 'react';
import { useAccount} from "@gear-js/react-hooks";
import { RootState } from '../../store/index';
import { useSelector } from 'react-redux';

import Header from './partials/Header';
import WelcomeBanner from './partials/dashboard/WelcomeBanner';
import DashboardAvatars from './partials/dashboard/DashboardAvatars';
import FilterButton from './DropdownFilterr';
import Datepicker from './Datepicker';
import DashboardCard01 from './partials/dashboard/DashboardCard01';
import DashboardCard02 from './partials/dashboard/DashboardCard02';
import DashboardCard03 from './partials/dashboard/DashboardCard03';
import DashboardCard04 from './partials/dashboard/DashboardCard04';
import DashboardCard05 from './partials/dashboard/DashboardCard05';
import DashboardCard06 from './partials/dashboard/DashboardCard06';
import DashboardCard07 from './partials/dashboard/DashboardCard07';
import DashboardCard08 from './partials/dashboard/DashboardCard08';
import DashboardCard09 from './partials/dashboard/DashboardCard09';
import DashboardCard10 from './partials/dashboard/DashboardCard10';
import DashboardCard11 from './partials/dashboard/DashboardCard11';
import DashboardCard12 from './partials/dashboard/DashboardCard12';
import DashboardCard13 from './partials/dashboard/DashboardCard13';
import Banner from './partials/Banner';
import { ModalSendToken } from "../ModalTransaction/ModalSendToken";
import { ModalConvertTokens } from "../ModalTransaction/ModalConvertTokens";
import { ModalFunds } from "../ModalTransaction/ModalFunds";
import {AlertModal} from "../../components/AlertModal/AlertModal";


function Dashboard() {

  interface CryptoValues {
    gaia: any;
    vara: any;
  }
  
  interface PercentageChanges {
    gaia: number;
    vara: number;
  }
  

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
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}


      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        {/* <Header  /> */}

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-11/12 max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              {/* Line chart (Acme Plus) */}
              <DashboardCard01 onClick={openCard} />
              {/* Line chart (Acme Advanced) */}
              <DashboardCard02 image="/VaraCrypto.png" quantity={totalVara.toFixed(2)} metric={porcentajesCambio.vara.toFixed(2)} name="Vara" onClick={openCard} />
              {/* Line chart (Acme Professional) */}
              <DashboardCard03 total={totalTokens.toFixed(2)} />
              {/* Bar chart (Direct vs Indirect) */}
              <DashboardCard04 />
              {/* Line chart (Real Time Value) */}
              <DashboardCard05 />
              {/* Doughnut chart (Top Countries) */}
              <DashboardCard06 />
              {/* Table (Top Channels) */}
              <DashboardCard07 />
              {/* Line chart (Sales Over Time) */}
              <DashboardCard08 />
              {/* Stacked bar chart (Sales VS Refunds) */}
              {/* <DashboardCard09 /> */}
              {/* Card (Customers) */}
              <DashboardCard10 />
             
              {/* <DashboardCard11 />
             
              <DashboardCard12 />
            
              <DashboardCard13 /> */}
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

          </div>
        </main>


      </div>
    </div>
  );
}

export default Dashboard;