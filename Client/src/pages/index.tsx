import { Route, Routes } from 'react-router-dom';

import { Main } from './main';
import {Labs} from './Labs/Labs'
import { ViewTransactions } from './ViewTransactions/ViewTransactions';
import { Notificaciones } from './notificaciones/Notificaciones';
import { RedUser } from './red/Red';
import { Usuarios } from './Usuarios/Usuarios';
import GraficoEnergia from './GraficoEnergia/GraficoEnergia';
import { AuthForm } from './LoginAct/LoginAct';
import { NotificacionesConfig } from './notificacionesConfig/NotificacionesConfig';
import { AuthProvider } from '@/contexts/AuthContext';

const routes = [{ path: '/main', Page: Main },
{ path: '/labs', Page: Labs },
{ path: '/transactions', Page: ViewTransactions },
{ path: '/notificaciones', Page: Notificaciones },
{ path: '/Network', Page: RedUser },
{ path: '/usuarios', Page: Usuarios },
{ path: '/home', Page: GraficoEnergia },
{ path: '/', Page: AuthForm },
{ path: '/NotificacionesConfig', Page: NotificacionesConfig },

];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <AuthProvider><Routes>{getRoutes()}</Routes></AuthProvider>;
}

export { Routing };
