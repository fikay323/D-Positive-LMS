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
    calculateRating: (course: Course) => number;
    isAdmin: boolean;
}

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = (props: any) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { user } = useUser();

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const fetchAllCourses = async () => {
        const courses = await CourseService.getPublishedCourses();
        setAllCourses(courses);
    }

    const calculateRating = (course: Course) => {
        if (course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    useEffect(() => {
        const checkAdmin = async () => {
            if (user && user.primaryEmailAddress) {
                const email = user.primaryEmailAddress.emailAddress;
                const isUserAdmin = await AdminService.isAdmin(email);
                setIsAdmin(isUserAdmin);
            } else {
                setIsAdmin(false);
            }
        };
        checkAdmin();
    }, [user]);


    const value: AppContextType = {
        currency, allCourses, navigate, calculateRating, isAdmin
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}