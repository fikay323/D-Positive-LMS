import React from 'react';

interface PaymentModalProps {
    onClose: () => void;
    coursePrice: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, coursePrice }) => {
    const accountName = 'Caleb Fagbenro';
    const accountNumber = '0123456789';
    const bankName = 'Access Bank';
    const gmail = 'fagbenrocoa@gmail.com';

    return (
        <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fade-in'>

                {/* Close Button */}
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
                            <span className='font-semibold text-gray-800'>{ bankName }</span>
                        </div>
                        <div className='flex justify-between border-b border-blue-100 pb-2'>
                            <span className='text-gray-500 text-sm'>Account Number</span>
                            <span className='font-semibold text-gray-800 tracking-wider'>{ accountNumber }</span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='text-gray-500 text-sm'>Account Name</span>
                            <span className='font-semibold text-gray-800'>{ accountName }</span>
                        </div>
                    </div>
                </div>

                <div className='text-center'>
                    <p className='text-xs text-gray-500 mb-2'>After payment, send your receipt to:</p>
                    <p className='font-medium text-blue-600 mb-6'>{ gmail }</p>

                    <button
                        onClick={onClose}
                        className='w-full bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-800 transition'
                    >
                        I Have Sent the Money
                    </button>
                    <p className='text-[10px] text-gray-400 mt-2'>Your course will be activated manually after verification.</p>
                </div>

            </div>
        </div>
    );
};

export default PaymentModal;