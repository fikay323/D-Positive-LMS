import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import type { Course } from "../models/course.model.js";
import { CourseService } from "../services/courseService.js";
import { AdminService } from "../services/adminService.js";

interface AppContextType {
    currency: string;
    allCourses: Course[];
    navigate: any;
    isAdmin: boolean;
    isAdminLoading: boolean;
}

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = (props: any) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);

    const fetchAllCourses = async () => {
        const courses = await CourseService.getPublishedCourses();
        setAllCourses(courses);
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    useEffect(() => {
        const checkAdmin = async () => {
            if (!isLoaded) return;

            if (user && user.primaryEmailAddress) {
                const email = user.primaryEmailAddress.emailAddress;
                const isUserAdmin = await AdminService.isAdmin(email);
                setIsAdmin(isUserAdmin);
            } else {
                setIsAdmin(false);
            }

            setIsAdminLoading(false);
        };
        checkAdmin();
    }, [user, isLoaded]);


    const value: AppContextType = {
        currency, allCourses, navigate, isAdmin, isAdminLoading
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}