import { collection, addDoc, getDocs, query, where, doc, updateDoc, orderBy } from 'firebase/firestore';

import type { PurchaseRequest } from '../models/purchase.model.js';
import { db } from '../firebase.js';
import { CourseService } from './courseService.js';

export const PurchaseService = {
    createRequest: async (data: Omit<PurchaseRequest, 'id' | 'status' | 'createdAt'>) => {
        try {
            await addDoc(collection(db, "purchaseRequests"), {
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error creating purchase request:", error);
            throw error;
        }
    },

    getRequestsByStatus: async (status: 'pending' | 'completed' | 'declined'): Promise<PurchaseRequest[]> => {
        try {
            const q = query(
                collection(db, "purchaseRequests"), 
                where("status", "==", status),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PurchaseRequest));
        } catch (error) {
            console.error("Error fetching requests:", error);
            return [];
        }
    },

    updateRequestStatus: async (requestId: string, newStatus: 'completed' | 'declined' | 'pending', courseId?: string, userId?: string) => {
        try {
            const requestRef = doc(db, "purchaseRequests", requestId);
            
            if (newStatus === 'completed' && courseId && userId) {
                await CourseService.enrollStudent(courseId, userId);
            }

            await updateDoc(requestRef, { status: newStatus });
        } catch (error) {
            console.error("Error updating request:", error);
            throw error;
        }
    }
};