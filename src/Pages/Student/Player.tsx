import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppContext.js';
import Loading from '../../Component/Student/Loading.jsx';
import { useUser } from '@clerk/clerk-react';
import type { ChapterContent, Course } from '../../models/course.model.js';

const Player = () => {

  const { courseId } = useParams();
  const { allCourses } = useContext(AppContext);
  const { user } = useUser()

  const [courseData, setCourseData] = useState<Course | null>(null)
  const [currentLecture, setCurrentLecture] = useState<ChapterContent | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = useState<Number | null>(0)
  
  // Security: Blur content when window loses focus
  const [isTabActive, setIsTabActive] = useState(true);

  // 1. Fetch Course Data
  useEffect(() => {
    const findCourse = allCourses.find(course => course._id === courseId) ?? null;
    setCourseData(findCourse);
    
    // Set default first lecture
    if (findCourse && findCourse.courseContent?.length > 0) {
        const firstChapter = findCourse?.courseContent[0];
        if(firstChapter!.chapterContent?.length > 0) {
            setCurrentLecture(firstChapter!.chapterContent[0] ?? null);
        }
    }
  }, [allCourses, courseId])


  // 2. Security: Handle Tab Visibility (Anti-Screen Capture deterrent)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(!document.hidden);
    };
    
    // Optional: Blur when window loses focus (e.g. clicking snipping tool)
    const handleBlur = () => setIsTabActive(false);
    const handleFocus = () => setIsTabActive(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);


  // Helper: Identify content type
  const isVideo = (url: string) => url && (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov'));
  const isPDF = (url: string) => url && url.includes('.pdf');


  if (!courseData) return <Loading />

  return (
    <>
      {/* Top Navigation Bar */}
      <div className='p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-50'>
        <div className='flex items-center gap-4'>
            <Link to={`/course/${courseId}`} className='p-2 hover:bg-gray-100 rounded-full'>
                {/* Left Arrow Icon */}
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
                <h1 className='text-lg font-bold text-gray-800 leading-tight'>{courseData.courseTitle}</h1>
                <p className='text-xs text-gray-500'>Now Playing: {currentLecture?.lectureTitle || "Select a lecture"}</p>
            </div>
        </div>
        
        {/* Progress or Rating could go here */}
        <button className='bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition'>Rate Course</button>
      </div>

      {/* Main Layout */}
      <div className='flex md:flex-row flex-col h-[calc(100vh-80px)]'>
        
        {/* --- LEFT: Player Area (75% width on desktop) --- */}
        <div className='flex-1 bg-black relative flex items-center justify-center overflow-hidden group'>
            
            {/* Security Wrapper */}
            <div className={`w-full h-full relative transition-opacity duration-200 ${isTabActive ? 'opacity-100' : 'opacity-0 blur-xl'}`}>
                
                {currentLecture ? (
                    <>
                        {/* 1. Video Player */}
                        {isVideo(currentLecture.lectureUrl) && (
                             <video 
                                src={currentLecture.lectureUrl} 
                                controls 
                                controlsList="nodownload" // Basic HTML5 download deterrent
                                className='w-full h-full object-contain'
                                onContextMenu={(e) => e.preventDefault()} // Disable Right Click
                             />
                        )}

                        {isPDF(currentLecture.lectureUrl) && (
                            <object
                                data={currentLecture.lectureUrl}
                                type="application/pdf"
                                className='w-full h-full bg-gray-100'
                            >
                                <div className='flex items-center justify-center h-full gap-2 text-gray-500'>
                                   <p>Your browser cannot display PDFs directly.</p>
                                </div>
                            </object>
                        )}

                        {/* Fallback for unknown types */}
                        {!isVideo(currentLecture.lectureUrl) && !isPDF(currentLecture.lectureUrl) && (
                             <div className='text-white text-center'>
                                <p className='mb-2'>Preview not available for this file type.</p>
                                <a href={currentLecture.lectureUrl} target="_blank" rel="noreferrer" className='text-blue-400 underline'>Open externally</a>
                             </div>
                        )}
                    </>
                ) : (
                    <div className='text-gray-400'>Select a lecture to start</div>
                )}
                
                {/* --- WATERMARK OVERLAY --- */}
                {user && (
                    <div className='absolute inset-0 pointer-events-none z-20 overflow-hidden'>
                        {/* Moving Watermark (Simple implementation: Center + Random/Grid) */}
                        <div className='absolute top-10 left-10 opacity-20 text-white text-xl font-bold rotate-[-15deg] select-none'>
                            {user.primaryEmailAddress?.emailAddress}
                        </div>
                        <div className='absolute bottom-10 right-10 opacity-20 text-white text-xl font-bold rotate-[-15deg] select-none'>
                            {user.id}
                        </div>
                        {/* Center Watermark */}
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 text-white text-4xl font-black rotate-[-30deg] whitespace-nowrap select-none'>
                            DO NOT DISTRIBUTE
                        </div>
                    </div>
                )}
            </div>

            {/* Inactive Warning (When user tabs away) */}
            {!isTabActive && (
                 <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/90 text-white'>
                    <div className='text-center'>
                        <p className='text-2xl font-bold mb-2'>Playback Paused</p>
                        <p className='text-gray-400'>Please keep this window active to view content.</p>
                    </div>
                 </div>
            )}
        </div>


        {/* --- RIGHT: Sidebar (25% width on desktop) --- */}
        <div className='md:w-96 w-full bg-white border-l border-gray-200 overflow-y-auto'>
            <div className='p-4 border-b border-gray-200'>
                <h2 className='font-bold text-gray-800'>Course Content</h2>
            </div>

            {courseData.courseContent.map((chapter, cIndex) => (
                <div key={cIndex} className='border-b border-gray-100'>
                    {/* Chapter Header */}
                    <div 
                        className='bg-gray-50 px-4 py-3 cursor-pointer flex justify-between items-center'
                        onClick={() => setCurrentSectionIndex(currentSectionIndex === cIndex ? null : cIndex)}
                    >
                        <h3 className='font-semibold text-sm text-gray-700'>{chapter.chapterTitle}</h3>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${currentSectionIndex === cIndex ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {/* Lecture List */}
                    <div className={`transition-all duration-300 ${currentSectionIndex === cIndex ? 'block' : 'hidden'}`}>
                        {chapter.chapterContent.map((lecture, lIndex) => (
                            <div 
                                key={lIndex}
                                onClick={() => setCurrentLecture(lecture)}
                                className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-blue-50 transition-colors ${currentLecture?.lectureId === lecture.lectureId ? 'bg-blue-100 border-l-4 border-blue-600' : 'border-l-4 border-transparent'}`}
                            >
                                <div className='mt-1'>
                                    {/* Icon changes based on type */}
                                    {isVideo(lecture.lectureUrl) ? (
                                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${currentLecture?.lectureId === lecture.lectureId ? 'text-blue-800' : 'text-gray-700'}`}>{lecture.lectureTitle}</p>
                                    <p className='text-xs text-gray-500 mt-1'>{lecture.lectureDuration} min</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

      </div>
    </>
  )
}

export default Player