import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

import { AppContext } from '../../Context/AppContext.js'
import type { ChapterContent, Course } from '../../models/course.model.js'
import Loading from '../../Component/Student/Loading.jsx'
import type { CourseLecture } from '../Educator/AddCourse.js'

const Player = () => {
    const { user } = useUser()
    const { courseId } = useParams()
    const { allCourses } = useContext(AppContext)
    
    const [courseData, setCourseData] = useState<Course | null>(null)
    const [currentLecture, setCurrentLecture] = useState<ChapterContent | null>(null)
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(0)
    
    useEffect(() => {
        const findCourse = allCourses.find(course => course._id === courseId) ?? null;
        setCourseData(findCourse)
        
        if (findCourse && findCourse.courseContent?.length > 0) {
            const firstChapter = findCourse.courseContent[0]!;
            if(firstChapter.chapterContent?.length > 0) {
                setCurrentLecture(firstChapter?.chapterContent?.[0] ?? null)
            }
        }
    }, [allCourses, courseId])

    const isVideo = (url: string) => {
        if(!url) return false;
        const lower = url.toLowerCase();
        return lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mkv');
    }

    if (!courseData) return <Loading />

    return (
        <>
        <div className='p-4 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm sticky top-0 z-50'>
            <div className='flex items-center gap-4'>
                <Link to={`/course/${courseId}`} className='p-2 hover:bg-gray-100 rounded-full'>
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </Link>
                <div>
                    <h1 className='text-lg font-bold text-gray-800 leading-tight'>{courseData.courseTitle}</h1>
                    <p className='text-xs text-gray-500'>Now Playing: {currentLecture?.lectureTitle || "Select a lecture"}</p>
                </div>
            </div>
        </div>

        <div className='flex md:flex-row flex-col h-[calc(100vh-80px)]'>
            
            {/* --- LEFT: Player Area --- */}
            <div className='flex-1 bg-black relative flex items-center justify-center overflow-hidden'>
                {currentLecture ? (
                    <>
                        {/* 1. Video Player (Native HTML5) */}
                        {isVideo(currentLecture.lectureUrl) ? (
                                <video 
                                src={currentLecture.lectureUrl} 
                                controls 
                                autoPlay
                                controlsList="nodownload" 
                                className='w-full h-full object-contain'
                                />
                        ) : (
                            <iframe 
                                src={`https://docs.google.com/gview?url=${encodeURIComponent(currentLecture.lectureUrl)}&embedded=true`}
                                className='w-full h-full border-0'
                                title="Document Viewer"
                                allowFullScreen
                            />
                        )}

                        {user && (
                            <div className='absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden'>
                                <div className='w-full h-full opacity-[0.15] flex flex-wrap content-center justify-center gap-10 rotate-12 transform scale-150'>
                                    {/* Repeat user email to cover screen */}
                                    {[...Array(20)].map((_, i) => (
                                        <div key={i} className='text-white text-lg font-bold whitespace-nowrap select-none mix-blend-difference'>
                                            {"D-Positive Global Image Consult"}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className='text-gray-400'>Select a lecture to start</div>
                )}
            </div>

            {/* --- RIGHT: Sidebar --- */}
            <div className='md:w-96 w-full bg-white border-l border-gray-200 overflow-y-auto'>
                <div className='p-4 border-b border-gray-200'>
                    <h2 className='font-bold text-gray-800'>Course Content</h2>
                </div>

                {courseData.courseContent.map((chapter: CourseLecture, cIndex: number) => (
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
                                        {isVideo(lecture.lectureUrl) ? (
                                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
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