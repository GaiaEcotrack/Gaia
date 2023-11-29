import { Route, Routes } from 'react-router-dom';

import { Main } from './main';
import {Labs} from './Labs/Labs'
import { ViewTransactions } from './ViewTransactions/ViewTransactions';
import { Notificaciones } from './notificaciones/Notificaciones';
import { RedUser } from './red/Red';
import { Usuarios } from './Usuarios/Usuarios';

const routes = [{ path: '/main', Page: Main },
{ path: '/labs', Page: Labs },
{ path: '/transactions', Page: ViewTransactions },
{ path: '/notificaciones', Page: Notificaciones },
{ path: '/red', Page: RedUser },
{ path: '/usuarios', Page: Usuarios },

];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <Routes>{getRoutes()}</Routes>;
}

export { Routing };
