import React, { useState, type FormEvent } from 'react';
import { useUser } from '@clerk/clerk-react';
import uniqid from 'uniqid';

import type { ChapterContent, CreateCourseData, CourseLecture as Lecture } from '../../models/course.model.js';
import CourseBasicInfo from '../../Component/Educator/AddCourse/CourseBasicInfo.js';
import LectureItem from '../../Component/Educator/AddCourse/LectureItem.js';
import { CourseService } from '../../services/courseService.js';

export interface CourseLecture extends Lecture {
    collapsed?: boolean;
}

const AddCourse: React.FC = () => {
	const { user } = useUser();

	const [courseInfo, setCourseInfo] = useState({
		courseTitle: '',
		courseDescription: '',
		coursePrice: 0,
		discount: 0,
		courseThumbnail: ''
	});
	const [chapters, setChapters] = useState<CourseLecture[]>([]);
	const [pendingUploads, setPendingUploads] = useState<number>(0);

	const handleInfoChange = (field: string, value: any) => {
		setCourseInfo(prev => ({ ...prev, [field]: value }));
	};

	const incrementUploads = () => setPendingUploads(prev => prev + 1);
	const decrementUploads = () => setPendingUploads(prev => Math.max(0, prev - 1));

	const addChapter = () => {
		setChapters([...chapters, {
		chapterId: uniqid(),
		chapterOrder: chapters.length + 1,
		chapterTitle: "New Chapter",
		chapterContent: [],
		collapsed: false
		}]);
	};

	const removeChapter = (chapterId: string) => {
		setChapters(chapters.filter(ch => ch.chapterId !== chapterId));
	};

	const updateChapterTitle = (chapterId: string, title: string) => {
		setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, chapterTitle: title } : ch));
	};

	const toggleCollapse = (chapterId: string) => {
		setChapters(chapters.map(ch => ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch));
	};

	const addLecture = (chapterId: string) => {
		setChapters(chapters.map(ch => {
		if (ch.chapterId === chapterId) {
			return {
			...ch,
			chapterContent: [...ch.chapterContent, {
				lectureId: uniqid(),
				lectureTitle: "New Lecture",
				lectureDuration: 0,
				lectureUrl: "",
				isPreviewFree: false,
				lectureOrder: ch.chapterContent.length + 1
			}]
			};
		}
		return ch;
		}));
	};

	const removeLecture = (chapterId: string, lectureId: string) => {
		setChapters(chapters.map(ch => ch.chapterId === chapterId ? {
			...ch, chapterContent: ch.chapterContent.filter(l => l.lectureId !== lectureId)
		} : ch));
	};

	const updateLecture = (chapterId: string, lectureId: string, field: keyof ChapterContent, value: any) => {
		setChapters(chapters.map(ch => {
			if (ch.chapterId !== chapterId) return ch;
			return {
				...ch,
				chapterContent: ch.chapterContent.map(l => l.lectureId === lectureId ? { ...l, [field]: value } : l)
			};
		}));
	};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
	if(!user) return;

	const finalCourseData: CreateCourseData = {
        courseTitle: courseInfo.courseTitle,
        courseDescription: courseInfo.courseDescription,
        coursePrice: courseInfo.coursePrice,
        discount: courseInfo.discount,
        courseThumbnail: courseInfo.courseThumbnail,
        isPublished: true,
        educator: user.id,
        enrolledStudents: [],
        courseRatings: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        courseContent: chapters.map((ch, i) => ({
            chapterId: ch.chapterId,
            chapterOrder: i + 1,
            chapterTitle: ch.chapterTitle,
            chapterContent: ch.chapterContent.map((l, j) => ({
                lectureId: l.lectureId,
                lectureTitle: l.lectureTitle,
                lectureDuration: l.lectureDuration,
                lectureUrl: l.lectureUrl,
                isPreviewFree: l.isPreviewFree,
                lectureOrder: j + 1
            }))
        })),
    };

    const newCourseId = await CourseService.createCourse(finalCourseData);

    console.log("READY TO SAVE TO DB:", finalCourseData);
    alert("Course Published Successfully");
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8 font-outfit'>
      <div className='max-w-5xl mx-auto'>
        
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>Add New Course</h1>

        <form onSubmit={handleSubmit}>
          <CourseBasicInfo 
             {...courseInfo} 
             onInfoChange={handleInfoChange} 
             onUploadStart={incrementUploads}
             onUploadFinish={decrementUploads}
          />

          <div className='bg-white border border-gray-200 rounded-lg overflow-hidden mb-8'>
            <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                <h2 className='text-xl font-semibold text-gray-700'>Course Curriculum</h2>
                <button type="button" onClick={addChapter} className='bg-blue-50 text-blue-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-100'>+ Add Chapter</button>
            </div>
            
            <div className='bg-gray-50 p-6 space-y-4'>
                {chapters.map((chapter, index) => (
                    <div key={chapter.chapterId} className='border border-gray-200 rounded-md bg-white overflow-hidden'>
                        
                        {/* Chapter Header */}
                        <div className='bg-white p-4 flex items-center justify-between border-b border-gray-100'>
                            <div className='flex items-center gap-2 flex-1'>
                                <span className='font-bold text-gray-400'>0{index + 1}</span>
                                <input 
                                    type="text" 
                                    value={chapter.chapterTitle} 
                                    onChange={(e) => updateChapterTitle(chapter.chapterId, e.target.value)}
                                    className='bg-transparent font-semibold text-gray-800 outline-none w-full'
                                />
                            </div>
                            <div className='flex items-center gap-3'>
                                <button type="button" onClick={() => addLecture(chapter.chapterId)} className='text-blue-600 text-sm hover:underline'>+ Add Lecture</button>
                                <button type="button" onClick={() => toggleCollapse(chapter.chapterId)} className='text-gray-500'>
                                    <svg className={`w-5 h-5 transition-transform ${chapter.collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <button type="button" onClick={() => removeChapter(chapter.chapterId)} className='text-red-500'>✕</button>
                            </div>
                        </div>

                        {/* Lecture List */}
                        {!chapter.collapsed && (
                            <div className='p-4 space-y-2'>
                                {chapter.chapterContent.map((lecture) => (
                                    <LectureItem 
                                        key={lecture.lectureId}
                                        chapterId={chapter.chapterId}
                                        lecture={lecture}
                                        onUpdate={updateLecture}
                                        onRemove={removeLecture}
                                        onUploadStart={incrementUploads}
                                        onUploadFinish={decrementUploads}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>

          <div className='flex justify-end'>
             <button 
                type="submit" 
                disabled={pendingUploads > 0}
                className={`px-8 py-3 rounded-md font-semibold text-white transition flex items-center gap-2 ${pendingUploads > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
             >
                {pendingUploads > 0 ? `Wait, uploading ${pendingUploads} file(s)...` : "PUBLISH COURSE"}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCourse;