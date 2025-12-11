import {
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	setDoc,
	collection,
	where,
	getDocs,
	query,
} from "firebase/firestore";
import { db } from "../firebase.js";


type ServiceResponse = {
	success: boolean;
	message: string;
};

const ROLES_REF = doc(db, "settings", "roles");

export const AdminService = {
	async isAdmin(email: string | null | undefined): Promise<boolean> {
		if (!email) return false;
		try {
			const snap = await getDoc(ROLES_REF);
			if (!snap.exists()) return false;

			const data = snap.data();
			const admins: string[] = data?.adminEmails || [];
			return admins.includes(email);
		} catch (error) {
			console.error("Failed to check admin status", error);
			return false;
		}
	},

	async getAdmins(): Promise<string[]> {
		try {
			const snap = await getDoc(ROLES_REF);
			if (snap.exists()) {
				const data = snap.data();
				return (data?.adminEmails as string[]) || [];
			}
			return [];
		} catch (error) {
			console.error(error);
			return [];
		}
	},

	async addAdmin(
		email: string
	): Promise<ServiceResponse> {
		try {
			const snap = await getDoc(ROLES_REF);

			const usersRef = collection(db, "users");
			const q = query(usersRef, where("email", "==", email));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) {
				return {
					success: false,
					message: "User not found. They must sign up first.",
				};
			}

			if (!snap.exists()) {
				await setDoc(ROLES_REF, { adminEmails: [email] });
			} else {
				const currentAdmins = snap.data()?.adminEmails || [];
				if (currentAdmins.includes(email)) {
					return { success: false, message: "User is already an admin." };
				}
				await updateDoc(ROLES_REF, {
					adminEmails: arrayUnion(email),
				});
			}

			return { success: true, message: "Admin added successfully." };
		} catch (error) {
			console.error(error);
			return {
				success: false,
				message: "Internal Error: Failed to add admin.",
			};
		}
	},

	async removeAdmin(email: string): Promise<ServiceResponse> {
		try {
			await updateDoc(ROLES_REF, {
				adminEmails: arrayRemove(email)
			});
			return { success: true, message: "Admin removed successfully." };
		} catch (error) {
			console.error(error);
			return { success: false, message: "Failed to remove admin." };
		}
	}
};
