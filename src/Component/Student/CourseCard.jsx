import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AppContext } from '../../Context/AppContext'

const CourseCard = ({ course }) => {
	const { currency } = useContext(AppContext);

	return (
		<Link to={'/course/' + course._id} onClick={() => scrollTo(0, 0,)} className='border border-gray-700 overflow-hidden rounded-lg flex flex-col'>
			<img src={course.courseThumbnail} alt="" className='w-full h-44 xl:h-56 object-cover' />
			<div className='p-3 text-left flex-1 flex flex-col justify-between'>
				<h3 className='text-base font-semibold'>{course.courseTitle}</h3>
				<p className='text-base font-semibold text-green-900'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
			</div>
		</Link>
	)
}

export default CourseCard
