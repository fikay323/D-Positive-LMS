import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

import type { Course } from '../../models/course.model.js';
import { CourseService } from '../../services/courseService.js';
import Loading from '../../Component/Student/Loading.jsx';
import CourseCard from '../../Component/Student/CourseCard.jsx';

const MyEnrollments = () => {
	const { user, isLoaded } = useUser()
	const navigate = useNavigate()
	
	const [courses, setCourses] = useState<Course[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchEnrollments = async () => {
			if (user) {
				const data = await CourseService.getEnrolledCourses(user.id);
				setCourses(data);
			}
			setLoading(false);
		};

		if (isLoaded) {
			if(!user) {
				navigate('/sign-in');
			} else {
				fetchEnrollments();
			}
		}
	}, [user, isLoaded, navigate]);

  	if (loading) return <Loading />

	return (
		<div className='min-h-screen bg-white p-8 font-outfit'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-3xl font-bold text-gray-800 mb-8'>My Learning</h1>

				{courses.length > 0 ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
						{courses.map(course => (
							<div key={course._id} className='relative'>
								<CourseCard course={course} />
								
								<div className='mt-2'>
									<button 
										onClick={() => navigate(`/course/${course._id}/player`)}
										className='w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded hover:bg-blue-700 transition'
									>
										Continue Watching
									</button>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className='text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
						<h3 className='text-xl font-semibold text-gray-700 mb-2'>No courses yet</h3>
						<p className='text-gray-500 mb-6'>You haven't enrolled in any courses yet.</p>
						<button 
							onClick={() => navigate('/')}
							className='bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition'
						>
							Browse Courses
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default MyEnrollments