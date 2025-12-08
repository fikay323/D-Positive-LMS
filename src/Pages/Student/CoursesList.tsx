import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context/AppContext.jsx'
import SearchBar from '../../Component/Student/SearchBar.jsx'
import { useParams } from 'react-router-dom';
import CourseCard from '../../Component/Student/CourseCard.jsx'
import { X } from 'lucide-react'
import Footer from '../../Component/Student/Footer.jsx';
import type { Course } from '../../models/course.model.js';


const CoursesList = () => {

  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams()
  const [filteredCourse, setFilteredCourse] = useState<Course[]>([])

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      input ?
        setFilteredCourse(
          tempCourses.filter((item: { courseTitle: string; }) => item.courseTitle.toLowerCase().includes(input.toLowerCase()))
        )

        : setFilteredCourse(tempCourses)
    }
  }, [allCourses, input])

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div className=''>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List </h1>
            <p className='text-gray-500'>
              <span
                onClick={() => navigate('/')}
                className='text-blue-600 cursor-pointer'> Home
              </span> / CourseList
            </p>
          </div>
          <SearchBar data={input} />
        </div>

        {input &&
          <div className='inline-flex items-center gap-4 px-4 py-2 border-1 border-gray-400 rounded-[30px] mt-8 -mb-8 text-gray-800'>
            <p className='font-bold text-xl text-black'>{input}</p>
            < X className='cursor-pointer'
              onClick={() => navigate('/course-list')}
            />
          </div>

        }

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:px-0'>
          {filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CoursesList
