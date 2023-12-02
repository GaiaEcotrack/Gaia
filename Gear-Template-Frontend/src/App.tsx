import React from 'react';
import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { Routing } from 'pages';
import { SideBar } from 'pages/home/SideBar';

/* eslint-disable */
import GraficoEnergia from './pages/GraficoEnergia/GraficoEnergia';
import { SuperUser } from './pages/superUser/SuperUser';
import { Labs } from './pages/Labs/Labs';
import PanelUsuarioFinal from './pages/panelUsuarioFinal/PanelUsuarioFinal';
import 'App.css';
import {AuthForm} from 'components/LoginAct/LoginAct';
import { PublicProfile } from 'components/UserNew/UserNew';
import { initializeApp } from 'firebase/app';
import { config } from "./components/config/config"
import AuthRoute from './components/AuthRoute';

initializeApp(config.firebaseConfig);
 
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
      {window.location.pathname !== '/' && <Header isAccountVisible={isAccountReady} />}
      {window.location.pathname !== '/' && <SideBar />}
      
      <main>{isAppReady ? <Routing /> : <ApiLoader />}</main>
      <Routes>
        <Route path="/panelUsuarioFinal" element={<PanelUsuarioFinal />} />
        <Route path="/home" element={
        <AuthRoute>
          <GraficoEnergia />
        </AuthRoute>
        } />
        <Route path="/superUser" element={<SuperUser />} />
        <Route path="/" element={<AuthForm />} />
        <Route path='/lab' element={<Labs />} />
        <Route path='/settings' element={<PublicProfile/>} />
        <Route path='/loginPrueba' element={<AuthForm/>}/>
      </Routes>
    </div>
  );
}

export const App = withProviders(Component);
