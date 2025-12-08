import { collection, addDoc } from 'firebase/firestore';

import { db } from '../firebase.js'; 
import type { CreateCourseData } from '../models/course.model.js';

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
};