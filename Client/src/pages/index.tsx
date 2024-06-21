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
import { DeviceRegister } from '@/components/UserNew/DeviceRegister/DeviceRegister';
import { CredentialsReg } from '@/components/UserNew/Credentials/CredentialsReg';
import { Notifications } from '@/components/UserNew/Notifications/Notifications';
import { IdVerification } from '@/components/UserNew/Identification/IdVerification';
import { PlantsDashboard } from '@/components/DashBoard/PlantsDashboard';
import PaymentModalMp from '@/components/PaymentConfirmedModal/PaymentModalMp';
import { SecurityVerify } from '@/components/UserNew/SecuritySettings/SecurityVerify';
import DashboardAdmin from './DashboardAdmin/DashboardAdmin';
import DashboardInstaller from './DashboardInstaller/DashboardInstaller';
import IamInstaller from '@/components/UserNew/IamInstaller/IamInstaller';

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
{ path: '/idVerification', Page: IdVerification },
{ path: '/IamInstaller', Page: IamInstaller },
{ path: 'dashboard/plants', Page: PlantsDashboard },
{ path: '/payment', Page: PaymentModalMp },
{ path: '/security', Page: SecurityVerify },
{ path: '/dashAdmin', Page: DashboardAdmin },
{ path: '/dashInstaller', Page: DashboardInstaller },
];

function Routing() {
  const getRoutes = () => routes.map(({ path, Page }) => <Route key={path} path={path} element={<Page />} />);

  return <AuthProvider><Routes>{getRoutes()}</Routes></AuthProvider>;
}

export { Routing };
