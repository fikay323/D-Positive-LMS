import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import { AppContext } from '../../Context/AppContext'

const CoursesSection = () => {

  const {allCourses} = useContext(AppContext);

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-bold text-black'>Learn From The Best</h2>
      <p className='text-sm md:text-base text-gray-700 mt-3 pb-3'>Discover our top-rated courses across various categories. Equipping youths with 21st-century skills <br />for employment and sustainable development. </p>
      
      <div className='grid grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
        {allCourses.slice(0,4).map((course, index ) => <CourseCard key={index} course={course} />)}
      </div>

      <Link to={'/course-list'} onClick={() => scrollTo(0,0)} className='text-gray-800 border border-black px-3 py-1 rounded'>Show all Courses</Link>
    </div>
  )
}

export default CoursesSection
