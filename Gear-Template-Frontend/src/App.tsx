import { useApi, useAccount } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import { Routes, Route } from "react-router-dom";
import PanelUsuarioFinal from './pages/panelUsuarioFinal/PanelUsuarioFinal';
import GraficoEnergia from './pages/GraficoEnergia/GraficoEnergia';
import {ViewTransactions} from './components/ViewTransactions/ViewTransactions';
import Login from './pages/Login/Login'
import SuperUser from './pages/superUser/SuperUser';
import {Labs} from './pages/Labs/Labs';
import 'App.css';

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  const isAppReady = isApiReady && isAccountReady;

  return (
    
    <div className='font-sans bg-slate-200 text-white'>
      <Header isAccountVisible={isAccountReady} />
      <main>{isAppReady ? <Routing /> : <ApiLoader />}</main>
     <Routes>
      {/* <Route path="/" element={<Prueba/>} /> */}
      <Route path="/panelUsuarioFinal" element={<PanelUsuarioFinal/>} />
      <Route path="/graficoEnergia" element={<GraficoEnergia/>} />
      <Route path="/superUser" element={<SuperUser/>} />
      <Route path="/" element={<ViewTransactions/>} />
      <Route path="/login" element={<Login/>} />
      <Route path='/lab' element={<Labs/>}/>
     </Routes>
     </div>
      
    
  );
}

export const App = withProviders(Component);
