import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../Context/AppContext.js';
import type { Course } from '../../models/course.model.js';
import { PencilLine } from 'lucide-react';

const MyCourses: React.FC = () => {
    const { allCourses } = useContext(AppContext);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        setCourses(allCourses);
    }, [allCourses]);

    return (
        <div className='p-6'>
            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>All Courses</h2>
                <Link to="/educator/add-course">
                    <button className='bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition flex items-center gap-2'>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add New Course
                    </button>
                </Link>
            </div>

            <div className='overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-gray-50 text-gray-600 text-sm uppercase'>
                        <tr>
                            <th className='p-4 border-b'>Course Title</th>
                            <th className='p-4 border-b'>Price</th>
                            <th className='p-4 border-b'>Enrolled</th>
                            <th className='p-4 border-b text-center'>Status</th>
                        </tr>
                    </thead>
                    <tbody className='text-gray-700 text-sm'>
                        {courses.length > 0 ? courses.map((course) => (
                            <tr key={course._id} className='hover:bg-gray-50 transition border-b border-gray-100 last:border-0'>
                                <td className='p-4 flex items-center gap-3'>
                                    <img src={course.courseThumbnail} alt="" className='w-12 h-12 rounded object-cover bg-gray-200' />
                                    <span className='font-semibold truncate max-w-xs'>{course.courseTitle}</span>
                                </td>
                                <td className='p-4'>
                                    {course.coursePrice === 0 ? "Free" : `$${course.coursePrice}`}
                                </td>
                                <td className='p-4'>{course.enrolledStudents.length} Students</td>
                                <td className='p-4'>
                                    <span className='text-center flex items-center gap-2'>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {course.isPublished ? 'Active' : 'Draft'}
                                        </span>

                                        <Link to={`/educator/edit-course/${course._id}`}>
                                            <PencilLine size={20} className='text-blue-600 hover:text-blue-900' />
                                        </Link>
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className='p-8 text-center text-gray-400'>No courses found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyCourses;