import { useContext, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { AppContext } from '../../Context/AppContext.js'
import Loading from '../../Component/Student/Loading.jsx'
import { getSecureUrl } from '../../utils/utils.js'

const Player = () => {
    const { user } = useUser()
    const { courseId } = useParams()
    const { allCourses } = useContext(AppContext)
    
    const [courseData, setCourseData] = useState<any>(null)
    const [currentLecture, setCurrentLecture] = useState<any>(null)
    const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(0)
    
    // Resolved Public URL from R2
    const [playUrl, setPlayUrl] = useState<string>('') 

    // 1. Load Course Data
    useEffect(() => {
        const findCourse = allCourses.find(course => course._id === courseId) ?? null;
        setCourseData(findCourse)
        
        if (findCourse && findCourse.courseContent?.length > 0) {
            const firstChapter = findCourse.courseContent[0];
            setCurrentLecture(firstChapter?.chapterContent?.[0] ?? null)
        }
    }, [allCourses, courseId])

    // 2. Resolve the Secure/Public URL
    useEffect(() => {
        const fetchUrl = async () => {
            if (currentLecture?.lectureUrl) {
                const url = await getSecureUrl(currentLecture.lectureUrl);
                setPlayUrl(url || '');
            } else {
                setPlayUrl('');
            }
        };
        fetchUrl();
    }, [currentLecture]);

    const isVideo = (url: string) => url && (url.includes('.mp4') || url.includes('.webm') || url.includes('.mkv'));

    if (!courseData) return <Loading />

    return (
        <div className='flex md:flex-row flex-col h-screen'>
            {/* --- LEFT: Player Area --- */}
            <div className='flex-1 bg-black flex flex-col items-center justify-center relative overflow-hidden'>
                
                {/* Back Button */}
                <div className='absolute top-4 left-4 z-50'>
                    <Link to={`/course/${courseId}`} className='text-white bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors'>
                        ← Back
                    </Link>
                </div>

                {currentLecture && playUrl ? (
                    <>
                        {isVideo(playUrl) ? (
                            <video src={playUrl} controls autoPlay className='w-full h-full object-contain' />
                        ) : (
                            /* Document Viewer (PDF / PPT / DOC) */
                            <div className='w-full h-full flex flex-col relative bg-gray-100'>
                                
                                {/* 🌟 DOWNLOAD BUTTON: Fallback for large files */}
                                <div className='absolute top-4 right-4 z-50'>
                                    <a 
                                        href={playUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition-colors text-sm font-semibold'
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download File
                                    </a>
                                </div>

                                <iframe 
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(playUrl)}&embedded=true`}
                                    className='w-full h-full border-0'
                                    title="Google Viewer"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className='text-gray-500'>
                        {currentLecture ? "Loading content..." : "Select a lecture to start"}
                    </div>
                )}
            </div>

            {/* --- RIGHT: Sidebar --- */}
            <div className='md:w-96 bg-white border-l border-gray-200 overflow-y-auto h-full'>
                <div className='p-4 border-b border-gray-200'>
                    <h2 className='font-bold text-gray-800'>Course Content</h2>
                </div>
                
                {courseData.courseContent.map((chapter: any, cIndex: number) => (
                    <div key={cIndex} className='border-b border-gray-100'>
                        <div 
                            className='bg-gray-50 px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-100'
                            onClick={() => setCurrentSectionIndex(currentSectionIndex === cIndex ? null : cIndex)}
                        >
                            <span className='font-semibold text-sm text-gray-700'>{chapter.chapterTitle}</span>
                            <svg className={`w-4 h-4 text-gray-500 transition-transform ${currentSectionIndex === cIndex ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                        
                        {currentSectionIndex === cIndex && (
                            <div className='bg-white'>
                                {chapter.chapterContent.map((lecture: any, lIndex: number) => (
                                    <div 
                                        key={lIndex}
                                        onClick={() => setCurrentLecture(lecture)}
                                        className={`px-4 py-3 cursor-pointer flex items-center gap-3 border-l-4 transition-colors ${currentLecture?.lectureId === lecture.lectureId ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        {isVideo(lecture.lectureUrl) ? (
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        )}
                                        <span className='text-sm font-medium line-clamp-1'>{lecture.lectureTitle}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Player