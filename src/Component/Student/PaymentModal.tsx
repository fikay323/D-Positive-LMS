import React, { useState } from 'react';
import { PurchaseService } from '../../services/purchaseService.js';
import { useUser } from '@clerk/clerk-react';

interface PaymentModalProps {
    onClose: () => void;
    coursePrice: number;
    courseId: string;
    courseTitle: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, coursePrice, courseId, courseTitle}) => {
    const accountName = 'D-Positive Image Consult';
    const accountNumber = '0020018619';
    const bankName = 'Stanbic IBTC';
    const gmail = 'jobs.dpositive@gmail.com';

    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePaymentSent = async () => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            await PurchaseService.createRequest({
                userId: user.id,
                userName: user.fullName || "Unknown User",
                email: user.primaryEmailAddress?.emailAddress || "No Email",
                courseId,
                courseTitle,
                amount: coursePrice
            });

            alert("Payment Notification Sent! Your enrollment is pending verification.");
            onClose();
        } catch (error) {
            alert("Failed to send notification. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in'>
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 text-gray-400 hover:text-gray-600'
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <h2 className='text-xl font-bold text-gray-800 mb-2'>Complete Your Enrollment</h2>
                <p className='text-gray-600 text-sm mb-6'>
                    To access this course, please transfer the sum of <span className='font-bold text-black'>${coursePrice}</span> to the account below.
                </p>

                {/* Bank Details Card */}
                <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6'>
                    <div className='space-y-3'>
                        <div className='flex justify-between border-b border-blue-100 pb-2'>
                            <span className='text-gray-500 text-sm'>Bank Name</span>
                            <span className='font-semibold text-gray-800'>{bankName}</span>
                        </div>
                        <div className='flex justify-between border-b border-blue-100 pb-2'>
                            <span className='text-gray-500 text-sm'>Account Number</span>
                            <span className='font-semibold text-gray-800 tracking-wider'>{accountNumber}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-500 text-sm'>Account Name</span>
                            <span className='font-semibold text-gray-800'>{accountName}</span>
                        </div>
                    </div>
                </div>

                <div className='text-center'>
                    <p className='text-xs text-gray-500 mb-2'>After payment, send your receipt to:</p>
                    <p className='font-medium text-blue-600 mb-6'>{gmail}</p>

                    <button onClick={handlePaymentSent} disabled={isSubmitting}
                        className='w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition disabled:bg-gray-400'
                    >
                        {isSubmitting ? "Sending Notification..." : "I Have Sent the Money"}
                    </button>
                    <p className='text-[10px] text-gray-400 mt-2'>Admin will verify and activate your course shortly.</p>
                </div>

            </div>
        </div>
    );
};

export default PaymentModal;