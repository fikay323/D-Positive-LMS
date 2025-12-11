import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext.js';
import Loading from '../../Component/Student/Loading.jsx';
import type { Course } from '../../models/course.model.js';
import { useUser } from '@clerk/clerk-react';
import { CourseService } from '../../services/courseService.js';
import PaymentModal from '../../Component/Student/PaymentModal.js';

const CourseDetails = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { user } = useUser()

	const [courseData, setCourseData] = useState<Course | null>(null);
	const [expandedSection, setExpandedSection] = useState<Record<number, boolean>>({});
	const [isEnrolled, setIsEnrolled] = useState(false);
	const [showPaymentModal, setShowPaymentModal] = useState(false);

	const { allCourses, currency } = useContext(AppContext)

	const fetchCourseData = async () => {
		const findCourse = allCourses.find(course => course._id === id) ?? null;
		setCourseData(findCourse);

		if (findCourse && user && findCourse.enrolledStudents.includes(user.id)) {
			setIsEnrolled(true);
		}
	}

	useEffect(() => {
		fetchCourseData()
	}, [allCourses, id, user])

	const handleEnroll = async () => {
		if (!user) {
			alert("Please login to enroll.");
			return;
		}

		if (!courseData) return;

		if (courseData.coursePrice > 0) {
			setShowPaymentModal(true);
			return;
		}

		// If FREE, proceed with instant enrollment
		try {
			await CourseService.enrollStudent(courseData._id, user.id);
			setIsEnrolled(true);
			alert("Enrollment Successful!");
		} catch (error) {
			console.error(error);
			alert("Enrollment failed. Please try again.");
		}
	}

	const toggleSection = (index: number) => {
		setExpandedSection((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	const calculateCourseStats = (course: Course) => {
		let totalLectures = 0;
		let totalDuration = 0;

		course.courseContent.forEach(chapter => {
			totalLectures += chapter.chapterContent.length;
			chapter.chapterContent.forEach(lecture => {
				totalDuration += lecture.lectureDuration;
			});
		});

		const hours = Math.floor(totalDuration / 60);
		const minutes = totalDuration % 60;
		const durationString = `${hours}h ${minutes}m`;

		return { totalLectures, durationString };
	};

	if (!courseData) return <Loading />

	const { totalLectures, durationString } = calculateCourseStats(courseData);

	return (
		<>
			{showPaymentModal && courseData && (
				<PaymentModal 
					courseTitle={courseData.courseTitle}
					courseId={courseData._id}
					coursePrice={courseData.coursePrice} 
					onClose={() => setShowPaymentModal(false)} 
				/>
			)}
			<div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
				{/* Background Gradient */}
				<div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

				{/* --- Left Column --- */}
				<div className='max-w-xl z-10 text-gray-500'>

					{/* Header */}
					<h1 className='md:text-4xl text-2xl font-bold text-gray-800 mb-4'>
						{courseData.courseTitle}
					</h1>

					{/* Ratings & Educator */}
					<div className='flex items-center gap-2 text-sm mb-6'>
						<span className='text-gray-500'>{courseData.enrolledStudents.length} student{courseData.enrolledStudents.length > 1 ? 's' : ''}</span>
					</div>

					{/* Course Structure */}
					<div className='border border-gray-300 rounded-md overflow-hidden mb-8'>
						<div className='bg-gray-100 p-4 border-b border-gray-300'>
							<h3 className='font-semibold text-gray-800'>Course Structure</h3>
							<p className='text-sm text-gray-500 mt-1'>
								{courseData.courseContent.length} sections • {totalLectures} lectures • {durationString} total duration
							</p>
						</div>

						<div className='bg-white'>
							{courseData.courseContent.map((chapter, index) => (
								<div key={index} className='border-b border-gray-200 last:border-0'>
									<div
										className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 bg-gray-50'
										onClick={() => toggleSection(index)}
									>
										<div className='flex items-center gap-2'>
											{/* Down Arrow Icon */}
											<svg className={`w-4 h-4 transition-transform ${expandedSection[index] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
											<span className='font-medium text-gray-800'>{chapter.chapterTitle}</span>
										</div>
										<span className='text-sm text-gray-500'>{chapter.chapterContent.length} lectures - {Math.floor(chapter.chapterContent.reduce((acc, l) => acc + l.lectureDuration, 0))}m</span>
									</div>

									{/* Lectures List */}
									<div className={`overflow-hidden transition-all duration-300 ${expandedSection[index] ? 'max-h-96' : 'max-h-0'}`}>
										<ul className='text-sm text-gray-600 bg-white'>
											{chapter.chapterContent.map((lecture, i) => (
												<li key={i} className='flex items-center justify-between p-3 pl-8 border-t border-gray-100 hover:bg-gray-50'>
													<div className='flex items-center gap-2'>
														{/* Play Icon */}
														<svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
														<span>{lecture.lectureTitle}</span>
													</div>
													<span>{lecture.lectureDuration}m</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Description */}
					<h3 className='text-xl font-bold text-gray-800 mb-4'>Course Description</h3>
					<div
						className='text-sm text-gray-600 leading-relaxed rich-text-content'
						dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
					></div>

				</div>

				{/* --- Right Column (Sticky Card) --- */}
				<div className='md:w-[400px] w-full z-10 shadow-lg rounded-t-lg overflow-hidden bg-white'>
					{/* Thumbnail */}
					<div className='relative'>
						<img src={courseData.courseThumbnail} alt="Course Thumbnail" className='w-full h-48 object-cover' />
					</div>

					<div className='p-6'>
						<div className='flex items-end gap-3 mb-4'>
							<span className='text-3xl font-bold text-gray-900'>
								{currency + courseData.coursePrice.toFixed(2)}
							</span>
						</div>

						{/* Stats Row */}
						<div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
							<div className='flex items-center gap-1'>
								<svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
								<span>{durationString}</span>
							</div>
							<div className='h-4 w-px bg-gray-300'></div>
							<div className='flex items-center gap-1'>
								<svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
								<span>{totalLectures} lessons</span>
							</div>
						</div>

						{/* --- ACTION BUTTON LOGIC --- */}
						{isEnrolled ? (
							<button
								onClick={() => navigate(`/course/${courseData._id}/player`)}
								className='w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-colors mb-6'
							>
								Continue to Course
							</button>
						) : (
							<button
								onClick={handleEnroll}
								className='w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors mb-6'
							>
								{courseData.coursePrice === 0 ? "Enroll for Free" : "Enroll Now"}
							</button>
						)}

						<div>
							<h4 className='font-semibold text-gray-800 mb-3'>What's in the course?</h4>
							<ul className='text-sm text-gray-500 space-y-2 list-disc list-inside'>
								<li>Lifetime access with free updates.</li>
								<li>Step-by-step, hands-on project guidance.</li>
								<li>Downloadable resources and source code.</li>
								<li>Quizzes to test your knowledge.</li>
								<li>Certificate of completion.</li>
							</ul>
						</div>
					</div>
				</div>

			</div>
		</>
	)
}

export default CourseDetails