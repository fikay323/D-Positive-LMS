import { collection, addDoc, query, where, getDocs, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

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
    },

    getCourseById: async (id: string): Promise<Course | null> => {
        try {
            const docRef = doc(db, "courses", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { _id: docSnap.id, ...docSnap.data() } as Course;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching course by ID:", error);
            throw error;
        }
    },

    getEnrolledCourses: async (userId: string): Promise<Course[]> => {
        try {
            const courseRef = collection(db, "courses");
            const q = query(courseRef, where("enrolledStudents", "array-contains", userId));
            
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ 
                _id: doc.id, 
                ...doc.data() 
            })) as Course[];
        } catch (error) {
            console.error("Error fetching enrolled courses:", error);
            return [];
        }
    },

    updateCourse: async (id: string, courseData: Partial<CreateCourseData>): Promise<void> => {
        try {
            const courseRef = doc(db, "courses", id);
            await updateDoc(courseRef, {
                ...courseData,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    },

    enrollStudent: async (courseId: string, userId: string): Promise<void> => {
        try {
            const courseRef = doc(db, "courses", courseId);
            
            await updateDoc(courseRef, {
                enrolledStudents: arrayUnion(userId)
            });
        } catch (error) {
            console.error("Error enrolling student:", error);
            throw error;
        }
    }
};