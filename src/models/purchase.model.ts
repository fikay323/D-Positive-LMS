export interface PurchaseRequest {
    id?: string;
    userId: string;
    userName: string;
    email: string;
    courseId: string;
    courseTitle: string;
    amount: number;
    status: 'pending' | 'completed' | 'declined';
    createdAt: string;
}