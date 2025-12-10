import React, { useState, useEffect } from 'react';

import { CourseService } from '../../services/courseService.js';
import { UserService } from '../../services/userService.js';
import type { Course } from '../../models/course.model.js';

const EnrollStudent = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [email, setEmail] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const [userFound, setUserFound] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);

    // 1. Fetch all courses for the dropdown
    useEffect(() => {
        const loadCourses = async () => {
            const data = await CourseService.getPublishedCourses();
            setCourses(data);
            if (data.length > 0) setSelectedCourseId(data[0]!._id);
        };
        loadCourses();
    }, []);

    // 2. Search for the user
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

    // 3. Enroll the user
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

    return (
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
    )
}

export default EnrollStudent;