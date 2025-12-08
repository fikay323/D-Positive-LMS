import { createContext, useEffect, useState } from "react";
import { dummyCourses } from '../assets/assets.js'
import { useNavigate } from "react-router-dom";
import type { Course } from "../models/course.model.js";

interface AppContextType {
    currency: string;
    allCourses: Course[];
    navigate: any;
    calculateRating: (course: Course) => number;
    isEducator: boolean;
    setIsEducator: (value: boolean) => void;
}

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = (props: any) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isEducator, setIsEducator] = useState(true);

    // Fetch All Courses
    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses);
    }

    // Function to calculate average rating of courses..
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


    const value: AppContextType = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}