import React from 'react';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { Routing } from 'pages';
import { SideBar } from 'pages/home/SideBar';
/* eslint-disable */
import { NotificacionesConfig } from 'pages/notificacionesConfig/NotificacionesConfig';
import { GraficoEnergia } from './pages/GraficoEnergia/GraficoEnergia';
import { Welcome } from './pages/Login/Login';
import { SuperUser } from './pages/superUser/SuperUser';
import { Labs } from './pages/Labs/Labs';
import PanelUsuarioFinal from './pages/panelUsuarioFinal/PanelUsuarioFinal';
import 'App.css';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const navigate = useNavigate();

  const isAppReady = isApiReady && isAccountReady;

  // Redirigir a la página de inicio si la aplicación está lista pero la ruta es '/'
  React.useEffect(() => {
    if (isAppReady && window.location.pathname === '/') {
      navigate('/');
    }
  }, [isAppReady, navigate]);

  return (
    <div className='font-sans bg-slate-200 text-white'>
      <Header isAccountVisible={isAccountReady} />
      {window.location.pathname !== '/' && <SideBar />}
      <main>{isAppReady ? <Routing /> : <ApiLoader />}</main>
      <Routes>
        <Route path="/panelUsuarioFinal" element={<PanelUsuarioFinal />} />
        <Route path="/home" element={<GraficoEnergia />} />
        <Route path="/superUser" element={<SuperUser />} />
        <Route path="/" element={<Welcome />} />
        <Route path='/lab' element={<Labs />} />
        <Route path='/notificacionesConfig' element={<NotificacionesConfig />} />
      </Routes>
    </div>
  );
}

export const App = withProviders(Component);
