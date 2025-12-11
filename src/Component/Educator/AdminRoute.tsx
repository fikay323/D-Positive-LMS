import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AppContext } from '../../Context/AppContext.js';

const AdminRoute = () => {
    const { isAdmin } = useContext(AppContext);

    // If Admin: Render the child routes (The Dashboard)
    // If Not: Kick them to Home Page
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;