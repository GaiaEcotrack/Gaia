import "@gear-js/vara-ui/dist/style.css";
import 'tailwindcss/tailwind.css';
import './index.css'
import { useAccount, useApi } from "@gear-js/react-hooks";
import { ApiLoader } from "@/components";
import { withProviders } from "@/app/hocs";
import { useWalletSync } from "@/features/wallet/hooks";
import { Routes, Route, useLocation } from "react-router-dom";
import { Routing } from './pages/index';
import { SideBar } from './pages/home/SideBar';
import DashBoard from "./components/DashBoard/DashBoard";
/* eslint-disable */
import { SuperUser } from './pages/superUser/SuperUser';
import { Labs } from './pages/Labs/Labs';
import PanelUsuarioFinal from './pages/panelUsuarioFinal/PanelUsuarioFinal';
import { AuthForm } from './pages/LoginAct/LoginAct';
import { PublicProfile } from './components/UserNew/UserNew';
import { initializeApp } from 'firebase/app';
import { config } from "./components/config/config"
import { Footer } from './pages/Footer/Footer';
import Logo from "./pages/Logo/Logo";
import TermsAndPolicy from "./pages/terms&policies/Terms&policy";
import Face from "./components/Face/Face";
import AuthRoute from "./components/AuthRoute";
// import { AuthProvider } from "./contexts/AuthContext";


initializeApp(config.firebaseConfig);

function Component() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();
  const location = useLocation();

  useWalletSync();

  const isAppReady = isApiReady && isAccountReady;
  const shouldShowSidebar = !['/dashboard'].includes(location.pathname);
  const shouldShowFooter = !['/dashboard'].includes(location.pathname);

  return (    
    <div className='font-sans bg-gradient-to-tr from-[#181745] from-10% via-[#181745] via-30% to-[#216e93] to-90% text-white'>
      {shouldShowSidebar && 
        location.pathname !== '/assets/logo' &&
        location.pathname !== '/serviceTerms' &&
        location.pathname !== '/dataPrivacy' &&
        location.pathname !== '/' && <SideBar />}    

      <main>
        {location.pathname === '/assets/logo' && <Logo />}
        {location.pathname === '/serviceTerms' && <TermsAndPolicy />}
        {location.pathname === '/dataPrivacy' && <TermsAndPolicy />}

        {isAppReady && 
          !['/assets/logo', '/serviceTerms', '/dataPrivacy'].includes(location.pathname) && <Routing />}

        {!isAppReady && 
          !['/assets/logo', '/serviceTerms', '/dataPrivacy'].includes(location.pathname) && <ApiLoader />}
      </main>

      {/* <AuthRoute> */}
          <Routes>
            <Route path="/panelUsuarioFinal" element={<PanelUsuarioFinal />} />
            <Route path="/superUser" element={<SuperUser />} />
            <Route path='/lab' element={<Labs />} />
            <Route path='/settings' element={<PublicProfile/>} />
            {/* <Route path='/' element={<AuthForm/>}/> */}
            // // si se descomenta esta ruta se debe eliminar la otra de src/pages/index.tsx
          <Route path='/face' element={<Face/>}/>
          <Route path="/dashboard" element={<DashBoard />} />
          </Routes>
      {/* </AuthRoute> */}


      { shouldShowFooter && <Footer />}

    </div>
  );
}

export const App = withProviders(Component);
