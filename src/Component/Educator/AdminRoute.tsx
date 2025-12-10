import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { db } from '../../firebase.js';
import Loading from '../Student/Loading.jsx';

const AdminRoute = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (user) {
                try {
                    const rolesRef = doc(db, "settings", "roles");
                    const rolesSnap = await getDoc(rolesRef);

                    if (rolesSnap.exists()) {
                        const admins = rolesSnap.data()?.adminEmails || [];
                        const userEmail = user.primaryEmailAddress?.emailAddress;

                        if (admins.includes(userEmail)) {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                        }
                    } else {
                        // Failsafe: If no settings doc exists, nobody is admin
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Admin check failed", error);
                    setIsAdmin(false);
                }
            }
        };

        if (isLoaded && isSignedIn) {
            checkAdminStatus();
        } else if (isLoaded && !isSignedIn) {
            setIsAdmin(false);
        }
    }, [user, isLoaded, isSignedIn]);

    if (!isLoaded || isAdmin === null) return <Loading />;

    // If Admin: Render the child routes (The Dashboard)
    // If Not: Kick them to Home Page
    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;