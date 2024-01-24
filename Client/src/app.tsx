import "@gear-js/vara-ui/dist/style.css";
import 'tailwindcss/tailwind.css';
import './index.css'
import { useAccount, useApi } from "@gear-js/react-hooks";
import { ApiLoader } from "@/components";
import { Header } from "@/components/layout";
import { withProviders } from "@/app/hocs";
import { useWalletSync } from "@/features/wallet/hooks";
import { Routes, Route } from "react-router-dom";
import { Routing } from './pages/index';
import { SideBar } from './pages/home/SideBar';
/* eslint-disable */
import { SuperUser } from './pages/superUser/SuperUser';
import { Labs } from './pages/Labs/Labs';
import PanelUsuarioFinal from './pages/panelUsuarioFinal/PanelUsuarioFinal';
import {AuthForm} from './pages/LoginAct/LoginAct';
import { PublicProfile } from './components/UserNew/UserNew';
import { initializeApp } from 'firebase/app';
import { config } from "./components/config/config"
// import AuthRoute from './components/AuthRoute';
import {Footer} from './pages/Footer/Footer';
import Logo from "./pages/Logo/Logo";
import TermsAndPolicy from "./pages/terms&policies/Terms&policy";
import Face from "./components/Face/Face";

initializeApp(config.firebaseConfig);

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  useWalletSync();

  const isAppReady = isApiReady && isAccountReady;

  return (    
    <div className='font-sans bg-gradient-to-tr from-[#181745] from-10% via-[#181745] via-30% to-[#216e93] to-90% text-white'>
      {/* {window.location.pathname !== '/assets/logo' && 
      window.location.pathname !== '/' && <Header isAccountVisible={isAccountReady} />} */}

      {window.location.pathname !== '/assets/logo' &&
      window.location.pathname !== '/serviceTerms' &&
      window.location.pathname !== '/dataPrivacy' &&
      window.location.pathname !== '/' && <SideBar />}      

      <main>
        {(window.location.pathname === '/assets/logo') && <Logo />}
        {(window.location.pathname === '/serviceTerms') && <TermsAndPolicy />}
        {(window.location.pathname === '/dataPrivacy') && <TermsAndPolicy />}

        {isAppReady && 
        window.location.pathname !== '/assets/logo' &&
        window.location.pathname !== '/serviceTerms' &&
        window.location.pathname !== '/dataPrivacy' && <Routing />}

        {!isAppReady && 
        window.location.pathname !== '/assets/logo' &&
        window.location.pathname !== '/serviceTerms' &&
        window.location.pathname !== '/dataPrivacy' && <ApiLoader />}
      </main>
    
        <Routes>
          <Route path="/panelUsuarioFinal" element={<PanelUsuarioFinal />} />
          <Route path="/superUser" element={<SuperUser />} />
          <Route path='/lab' element={<Labs />} />
          <Route path='/settings' element={<PublicProfile/>} />
          <Route path='/loginPrueba' element={<AuthForm/>}/>
          <Route path='/face' element={<Face/>}/>
        </Routes>

      {window.location.pathname !== '/assets/logo' &&
      window.location.pathname !== '/serviceTerms' &&
      window.location.pathname !== '/dataPrivacy' &&
      window.location.pathname !== '/' && <Footer />}

  </div>
  );
}

export const App = withProviders(Component);
