import React, { useState, useEffect } from 'react';

import type { Course } from '../../models/course.model.js';
import type { PurchaseRequest } from '../../models/purchase.model.js';
import { CourseService } from '../../services/courseService.js';
import { UserService } from '../../services/userService.js';
import { PurchaseService } from '../../services/purchaseService.js';

const EnrollStudent = () => {
    const [activeTab, setActiveTab] = useState<'pending' | 'declined' | 'manual'>('pending');
    const [requests, setRequests] = useState<PurchaseRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const [manualEmail, setManualEmail] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [email, setEmail] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const [userFound, setUserFound] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    useEffect(() => {
        const loadCourses = async () => {
            const data = await CourseService.getPublishedCourses();
            setCourses(data);
            if (data.length > 0) setSelectedCourseId(data[0]!._id);
        };
        loadCourses();
    }, []);

    useEffect(() => {
        if (activeTab === 'manual') return;

        const fetchRequests = async () => {
            setLoading(true);
            const data = await PurchaseService.getRequestsByStatus(activeTab);
            setRequests(data);
            setLoading(false);
        };

        fetchRequests();
    }, [activeTab]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setUserFound(null);

        try {
            const user = await UserService.getUserByEmail(email);
            if (user) {
                setUserFound(user);
            } else {
                alert("User not found. Ask them to login to the app first.");
            }
        } catch (error) {
            alert("Error searching user.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleEnroll = async () => {
        if (!userFound || !selectedCourseId) return;

        setIsEnrolling(true);
        try {
            await CourseService.enrollStudent(selectedCourseId, userFound.id);
            alert(`Success! ${userFound.fullName || userFound.email} has been enrolled.`);

            setEmail('');
            setUserFound(null);
        } catch (error) {
            alert("Enrollment failed. They might already be enrolled.");
        } finally {
            setIsEnrolling(false);
        }
    };

    const handleApprove = async (req: PurchaseRequest) => {
        if (!window.confirm(`Confirm payment of ₦${req.amount} from ${req.userName}?`)) return;

        try {
            await PurchaseService.updateRequestStatus(req.id!, 'completed', req.courseId, req.userId);
            setRequests(prev => prev.filter(r => r.id !== req.id));
            alert("Student Enrolled Successfully!");
        } catch (error) {
            alert("Error approving request.");
        }
    };

    const handleDecline = async (reqId: string) => {
        if (!window.confirm("Are you sure you want to decline this payment?")) return;

        try {
            await PurchaseService.updateRequestStatus(reqId, 'declined');
            setRequests(prev => prev.filter(r => r.id !== reqId)); // Remove from list
        } catch (error) {
            alert("Error declining request.");
        }
    };

    const handlePushBack = async (reqId: string) => {
        try {
            await PurchaseService.updateRequestStatus(reqId, 'pending');
            setRequests(prev => prev.filter(r => r.id !== reqId));
            alert("Moved back to Pending list.");
        } catch (error) {
            alert("Error moving request.");
        }
    };

    return (
        <div className='p-8 font-outfit max-w-5xl mx-auto'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8'>Enrollment Management</h1>

            {/* Tabs */}
            <div className='flex gap-4 border-b border-gray-200 mb-6'>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                    Pending Requests
                </button>
                <button
                    onClick={() => setActiveTab('declined')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'declined' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500'}`}
                >
                    Declined History
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'manual' ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
                >
                    Manual Enroll (Search)
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className='bg-white p-6 shadow-sm rounded-lg border border-gray-200'>

                {/* 1. PENDING REQUESTS TABLE */}
                {activeTab === 'pending' && (
                    <>
                        {loading ? <p>Loading...</p> : requests.length === 0 ? <p className='text-gray-400'>No pending requests.</p> : (
                            <table className='w-full text-left'>
                                <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
                                    <tr>
                                        <th className='p-3'>Student</th>
                                        <th className='p-3'>Course</th>
                                        <th className='p-3'>Amount</th>
                                        <th className='p-3'>Date</th>
                                        <th className='p-3 text-right'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm'>
                                    {requests.map(req => (
                                        <tr key={req.id} className='border-b border-gray-100'>
                                            <td className='p-3'>
                                                <p className='font-bold'>{req.userName}</p>
                                                <p className='text-xs text-gray-500'>{req.email}</p>
                                            </td>
                                            <td className='p-3'>{req.courseTitle}</td>
                                            <td className='p-3 font-semibold'>₦{req.amount}</td>
                                            <td className='p-3 text-gray-500'>{new Date(req.createdAt).toLocaleDateString()}</td>
                                            <td className='p-3 text-right flex justify-end gap-2'>
                                                <button
                                                    onClick={() => handleApprove(req)}
                                                    className='bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold hover:bg-green-200'
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleDecline(req.id!)}
                                                    className='bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-100'
                                                >
                                                    Decline
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}

                {/* 2. DECLINED HISTORY TABLE */}
                {activeTab === 'declined' && (
                    <>
                        {requests.length === 0 ? <p className='text-gray-400'>No declined requests.</p> : (
                            <table className='w-full text-left opacity-75'>
                                <thead className='bg-gray-50 text-xs uppercase text-gray-500'>
                                    <tr>
                                        <th className='p-3'>Student</th>
                                        <th className='p-3'>Course</th>
                                        <th className='p-3 text-right'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='text-sm'>
                                    {requests.map(req => (
                                        <tr key={req.id} className='border-b border-gray-100'>
                                            <td className='p-3'>
                                                <p className='font-bold'>{req.userName}</p>
                                                <p className='text-xs text-gray-500'>{req.email}</p>
                                            </td>
                                            <td className='p-3'>{req.courseTitle}</td>
                                            <td className='p-3 text-right'>
                                                <button
                                                    onClick={() => handlePushBack(req.id!)}
                                                    className='text-blue-600 hover:underline text-xs'
                                                >
                                                    Push back to Pending
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}

                {/* 3. MANUAL ENROLL (Fallback) */}
                {activeTab === 'manual' && (
                    <div className='max-w-xl'>
                        <p className='text-sm text-gray-500 mb-4'>Use this to manually enroll a student who did not use the app's "I sent money" button.</p>

                        <div className='p-8 font-outfit max-w-3xl mx-auto'>
                            <h1 className='text-3xl font-bold text-gray-800 mb-8'>Manual Student Enrollment</h1>

                            <div className='bg-white p-6 shadow-md rounded-lg border border-gray-200'>

                                {/* STEP 1: FIND USER */}
                                <div className='mb-8 border-b border-gray-100 pb-8'>
                                    <h3 className='text-lg font-semibold text-gray-700 mb-4'>Step 1: Find Student</h3>
                                    <form onSubmit={handleSearch} className='flex gap-4'>
                                        <input
                                            type="email"
                                            placeholder="Student's Email Address"
                                            className='flex-1 border border-gray-300 rounded px-4 py-2 outline-none focus:border-blue-500'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSearching}
                                            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300'
                                        >
                                            {isSearching ? 'Searching...' : 'Search'}
                                        </button>
                                    </form>

                                    {/* Search Result Display */}
                                    {userFound && (
                                        <div className='mt-4 bg-green-50 text-green-800 p-4 rounded flex items-center gap-4'>
                                            {userFound.imageUrl && <img src={userFound.imageUrl} alt="" className='w-10 h-10 rounded-full' />}
                                            <div>
                                                <p className='font-bold'>{userFound.fullName || "No Name"}</p>
                                                <p className='text-sm'>{userFound.email}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* STEP 2: SELECT COURSE & ENROLL */}
                                <div className={`transition-opacity duration-500 ${userFound ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    <h3 className='text-lg font-semibold text-gray-700 mb-4'>Step 2: Assign Course</h3>

                                    <div className='mb-6'>
                                        <label className='block text-sm text-gray-600 mb-2'>Select Course</label>
                                        <select
                                            className='w-full border border-gray-300 rounded px-4 py-2 bg-white'
                                            value={selectedCourseId}
                                            onChange={(e) => setSelectedCourseId(e.target.value)}
                                        >
                                            {courses.map(course => (
                                                <option key={course._id} value={course._id}>
                                                    {course.courseTitle}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleEnroll}
                                        disabled={isEnrolling}
                                        className='w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 disabled:bg-gray-400'
                                    >
                                        {isEnrolling ? 'Processing...' : 'ENROLL STUDENT NOW'}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default EnrollStudent;