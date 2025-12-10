import { Key } from 'lucide-react'
import React, { useContext } from 'react'
import star from '../../assets/star.png'
import star_blank from '../../assets/star_blank.png'
import { AppContext } from '../../Context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {

  const {currency, calculateRating} = useContext(AppContext);

  return (
    <Link to={'/course/' + course._id} onClick={() => scrollTo(0,0,)}  className='border border-gray-700 pb-6 overflow-hidden rounded-lg'>
      <img src={course.courseThumbnail} alt="" className='w-full h-44 xl:h-56 object-cover'/>
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle}</h3>
        <p className='text-black'>{course.educator.name}</p>
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (<img src={i < Math.floor(calculateRating(course)) ? star : star_blank } alt="" />
            ) 
            
          )}
          </div>
          <p className='text-black'>{course.courseRatings.length}</p>
        </div>
        <p className='text-base font-semibold text-green-900'>{currency}{(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard
