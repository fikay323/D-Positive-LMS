import { doc, setDoc, getDoc, collection, where, query, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

export const UserService = {
    syncUser: async (user: any) => {
        try {
            const userRef = doc(db, "users", user.id);

            await setDoc(userRef, {
                email: user.primaryEmailAddress.emailAddress,
                fullName: user.fullName,
                imageUrl: user.imageUrl,
                lastLogin: new Date().toISOString()
            }, { merge: true });

        } catch (error) {
            console.error("Error syncing user:", error);
        }
    },

    getUserByEmail: async (email: string) => {
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0]!;
                return { id: userDoc.id, ...userDoc.data() };
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching user by email:", error);
            return null;
        }
    }
};