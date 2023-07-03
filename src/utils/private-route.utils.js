import { Navigate, Outlet } from 'react-router-dom';
import { checkTokenValidity } from './token.utils';

export const PrivateRoute = ({ element: Element, ...rest }) => {
    const isAuthenticated = checkTokenValidity();
    // console.log('element',Element)
    return isAuthenticated ? (
      <Outlet />
    ) : (
      <Navigate to="/login" />
    );
  };