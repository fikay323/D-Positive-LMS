import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

import { db } from '../firebase.js'; 
import type { Course, CreateCourseData } from '../models/course.model.js';

export const CourseService = {
    createCourse: async (courseData: CreateCourseData): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, "courses"), courseData);
            return docRef.id;
        } catch (error) {
            console.error("Error in CourseService.createCourse:", error);
            throw error;
        }
    },

    getPublishedCourses: async (): Promise<Course[]> => {
        try {
            const q = query(collection(db, "courses"), where("isPublished", "==", true));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                _id: doc.id, 
                ...doc.data()
            })) as Course[];
        } catch (error) {
            console.log("Error fetching courses:", error);
            return [];
        }
    }
};