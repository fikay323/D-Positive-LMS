import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext.tsx';
import Loading from '../../Component/Student/Loading';

const CourseDetails = () => {

  const { id } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [expandedSection, setExpandedSection] = useState({});

  const { allCourses } = useContext(AppContext)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id)
    setCourseData(findCourse);
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses, id])

  // Helper: Toggle Accordion
  const toggleSection = (index) => {
    setExpandedSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Helper: Calculate total lectures and duration
  const calculateCourseStats = (course) => {
    let totalLectures = 0;
    let totalDuration = 0; // assuming minutes
    
    course.courseContent.forEach(chapter => {
      totalLectures += chapter.chapterContent.length;
      chapter.chapterContent.forEach(lecture => {
        totalDuration += lecture.lectureDuration;
      });
    });

    // Convert minutes to hours and minutes
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;
    const durationString = `${hours}h ${minutes}m`;

    return { totalLectures, durationString };
  };

  // Helper: Calculate Rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;
    const totalRating = course.courseRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return (totalRating / course.courseRatings.length).toFixed(1);
  }

  if (!courseData) return <Loading />

  const { totalLectures, durationString } = calculateCourseStats(courseData);
  const averageRating = calculateRating(courseData);

  return (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        
        {/* Background Gradient */}
        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/* --- Left Column --- */}
        <div className='max-w-xl z-10 text-gray-500'>
          
          {/* Header */}
          <h1 className='md:text-4xl text-2xl font-bold text-gray-800 mb-4'>
            {courseData.courseTitle}
          </h1>
          
          <p className='text-sm md:text-base text-gray-600 mb-4'
             dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0, 200) + '...'}}>
          </p>

          {/* Ratings & Educator */}
          <div className='flex items-center gap-2 text-sm mb-6'>
             <div className='flex items-center text-amber-500'>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-current' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
             </div>
             <span className='font-semibold text-gray-800'>{averageRating}</span>
             <span className='text-gray-500'>({courseData.courseRatings.length} ratings)</span>
             <span className='text-gray-500'>• {courseData.enrolledStudents.length} students</span>
          </div>
          
          <p className='text-sm mb-8'>Course by <span className='text-blue-600 underline cursor-pointer'>{courseData.educator}</span></p>

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
            dangerouslySetInnerHTML={{__html: courseData.courseDescription}}
          ></div>

        </div>

        {/* --- Right Column (Sticky Card) --- */}
        <div className='md:w-[400px] w-full z-10 shadow-lg rounded-t-lg overflow-hidden bg-white'>
           {/* Thumbnail */}
           <div className='relative'>
             <img src={courseData.courseThumbnail} alt="Course Thumbnail" className='w-full h-48 object-cover' />
             <div className='absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer group'>
                 {/* Play Button Overlay */}
                 <div className='bg-white/90 p-3 rounded-full group-hover:scale-110 transition-transform'>
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                 </div>
             </div>
           </div>

           <div className='p-6'>
              <p className='text-red-500 font-semibold text-sm mb-2'>5 days left at this price!</p>
              
              <div className='flex items-end gap-3 mb-4'>
                <span className='text-3xl font-bold text-gray-900'>
                  ${(courseData.coursePrice - (courseData.discount * courseData.coursePrice / 100)).toFixed(2)}
                </span>
                <span className='text-gray-500 line-through text-lg'>${courseData.coursePrice}</span>
                <span className='text-gray-800 font-medium'>{courseData.discount}% off</span>
              </div>

              {/* Stats Row */}
              <div className='flex items-center gap-4 text-sm text-gray-600 mb-6'>
                 <div className='flex items-center gap-1'>
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    <span>{averageRating}</span>
                 </div>
                 <div className='h-4 w-px bg-gray-300'></div>
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

              <button className='w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition-colors mb-6'>
                Enroll Now
              </button>

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