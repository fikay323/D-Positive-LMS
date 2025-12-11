import React, { useEffect, useState } from 'react';
import { ShieldAlert, Trash2, UserPlus, X } from 'lucide-react';

import { AdminService } from '../../services/adminService.js';

const AdminManager: React.FC = () => {
    const [admins, setAdmins] = useState<string[]>([]);
    const [newEmail, setNewEmail] = useState<string>('');

    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

    useEffect(() => {
        loadAdmins();
    }, []);

    const loadAdmins = async () => {
        const list = await AdminService.getAdmins();
        setAdmins(list);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail) return;

        const result = await AdminService.addAdmin(newEmail);

        alert(result.message);

        if (result.success) {
            setNewEmail('');
            loadAdmins();
        }
    };

    const confirmDelete = (email: string) => {
        setSelectedEmail(email);
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        if (selectedEmail) {
            const result = await AdminService.removeAdmin(selectedEmail);
            alert(result.message);

            if (result.success) {
                await loadAdmins();
            }
            setShowConfirm(false);
            setSelectedEmail(null);
        }
    };

    return (
        <div className='p-6 text-gray-800'>
            <h2 className='text-2xl font-bold mb-6'>Manage Admins</h2>

            {/* Add Admin Form */}
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-xl'>
                <h3 className='font-semibold mb-4 flex items-center gap-2'>
                    <UserPlus size={20} className='text-blue-600' /> Add New Admin
                </h3>
                <form onSubmit={handleAdd} className='flex gap-4'>
                    <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Enter email address"
                        className='flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500'
                        required
                    />
                    <button type="submit" className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition'>
                        Add
                    </button>
                </form>
            </div>

            {/* List Admins */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 max-w-2xl'>
                <div className='p-4 border-b border-gray-200 bg-gray-50'>
                    <h3 className='font-semibold text-gray-700'>Current Administrators</h3>
                </div>
                <div className='divide-y divide-gray-100'>
                    {admins.map((email) => (
                        <div key={email} className='p-4 flex items-center justify-between hover:bg-gray-50'>
                            <p className='font-medium'>{email}</p>
                            <button
                                onClick={() => confirmDelete(email)}
                                className='text-red-500 hover:bg-red-50 p-2 rounded-full transition'
                                title="Remove Admin"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {admins.length === 0 && <p className='p-6 text-center text-gray-500'>No admins found.</p>}
                </div>
            </div>

            {showConfirm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
                    <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl'>
                        <div className='flex justify-between items-start mb-4'>
                            <div className='flex items-center gap-2 text-red-600 font-bold text-lg'>
                                <ShieldAlert /> Remove Access?
                            </div>
                            <button onClick={() => setShowConfirm(false)} className='text-gray-400 hover:text-gray-600'>
                                <X size={20}/>
                            </button>
                        </div>
                        <p className='text-gray-600 mb-6'>Are you sure you want to remove <strong>{selectedEmail}</strong>?</p>
                        <div className='flex justify-end gap-3'>
                            <button onClick={() => setShowConfirm(false)} className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded'>Cancel</button>
                            <button onClick={handleDelete} className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>Yes, Remove</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminManager;