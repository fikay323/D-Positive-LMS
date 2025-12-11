import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AppContext } from '../../Context/AppContext.js';
import Loading from '../Student/Loading.jsx';

const AdminRoute = () => {
    const { isAdmin, isAdminLoading } = useContext(AppContext);

    if (isAdminLoading) {
        return <Loading />; 
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;