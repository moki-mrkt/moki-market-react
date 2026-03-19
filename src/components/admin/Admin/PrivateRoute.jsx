import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../../services/authService';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const isAuth = authService.isAuthenticated();

    if (!isAuth) {
        return <Navigate to="/admin-ui/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;