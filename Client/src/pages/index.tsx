import { Route, Routes } from 'react-router-dom';

import { Main } from './main';
import {Labs} from './Labs/Labs'
import { ViewTransactions } from './ViewTransactions/ViewTransactions';
import { Notificaciones } from './notificaciones/Notificaciones';
import { RedUser } from './red/Red';
import { Usuarios } from './Usuarios/Usuarios';
import GraficoEnergia from './GraficoEnergia/GraficoEnergia';
import { AuthForm } from './LoginAct/LoginAct';
import Dashboard from './DashboardUser/Dashboard';
import { AuthProvider } from '@/contexts/AuthContext';
import { DeviceRegister } from '@/components/UserNew/DeviceRegister';
import { CredentialsReg } from '@/components/UserNew/CredentialsReg';
import { Notifications } from '@/components/UserNew/Notifications';

const routes = [{ path: '/main', Page: Main },
{ path: '/labs', Page: Labs },
{ path: '/transactions', Page: ViewTransactions },
{ path: '/notificaciones', Page: Notificaciones },
{ path: '/Network', Page: RedUser },
{ path: '/usuarios', Page: Usuarios },
{ path: '/home', Page: GraficoEnergia },
{ path: '/', Page: AuthForm },
{ path: '/DashUser', Page: Dashboard },
{ path: '/deviceReg', Page: DeviceRegister },
{ path: '/credentialsReg', Page: CredentialsReg },
{ path: '/notifications', Page: Notifications },

];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <AuthProvider><Routes>{getRoutes()}</Routes></AuthProvider>;
}

export { Routing };
