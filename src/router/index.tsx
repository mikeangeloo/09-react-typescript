import { createHashRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import InstallacionPage from '../pages/InstallacionPage';
import ComponentesPage from '../pages/ComponentesPage';
import UseStatePage from '../pages/UseStatePage';
import UseReducerPage from '../pages/UseReducerPage';
import UseContextPage from '../pages/UseContextPage';
import UseMemoCallbackPage from '../pages/UseMemoCallbackPage';
import TiposUtilesPage from '../pages/TiposUtilesPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/instalacion" replace /> },
      { path: 'instalacion',       element: <InstallacionPage /> },
      { path: 'componentes',       element: <ComponentesPage /> },
      { path: 'use-state',         element: <UseStatePage /> },
      { path: 'use-reducer',       element: <UseReducerPage /> },
      { path: 'use-context',       element: <UseContextPage /> },
      { path: 'use-memo-callback', element: <UseMemoCallbackPage /> },
      { path: 'tipos-utiles',      element: <TiposUtilesPage /> },
    ],
  },
]);
