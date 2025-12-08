import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import uniqid from 'uniqid';
import type { ChapterContent, CourseLecture as Lecture } from '../../models/course.model.js';

interface CourseLecture extends Lecture {
  collapsed: boolean;
}

const AddCourse: React.FC = () => {

  // --- 1. Basic Course Details State ---
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [courseDescription, setCourseDescription] = useState<string>('');
  const [coursePrice, setCoursePrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  
  // --- 2. Curriculum State ---
  const [chapters, setChapters] = useState<CourseLecture[]>([]);

  // --- Handlers: Course Basics ---
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImage(file);
    }
  };

  // --- Handlers: Chapters ---
  const addChapter = () => {
    const newChapter: CourseLecture = {
      chapterId: uniqid(), // Generate temp ID
      chapterOrder: chapters.length + 1,
      chapterTitle: "New Chapter",
      chapterContent: [],
      collapsed: false
    };
    setChapters([...chapters, newChapter]);
  };

  const removeChapter = (chapterId: string) => {
    setChapters(chapters.filter(ch => ch.chapterId !== chapterId));
  };

  const updateChapterTitle = (chapterId: string, newTitle: string) => {
    setChapters(chapters.map(ch => 
      ch.chapterId === chapterId ? { ...ch, chapterTitle: newTitle } : ch
    ));
  };

  const toggleChapterCollapse = (chapterId: string) => {
    setChapters(chapters.map(ch => 
      ch.chapterId === chapterId ? { ...ch, collapsed: !ch.collapsed } : ch
    ));
  };

  // --- Handlers: Lectures (Nested inside Chapters) ---
  const addLecture = (chapterId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.chapterId === chapterId) {
        const newLecture: ChapterContent = {
          lectureId: uniqid(),
          lectureTitle: "New Lecture",
          lectureDuration: 0,
          lectureUrl: "",
          isPreviewFree: false,
          lectureOrder: ch.chapterContent.length + 1
        };
        return {
          ...ch,
          chapterContent: [...ch.chapterContent, newLecture]
        };
      }
      return ch;
    }));
  };

  const removeLecture = (chapterId: string, lectureId: string) => {
    setChapters(chapters.map(ch => {
      if (ch.chapterId === chapterId) {
        return {
          ...ch,
          chapterContent: ch.chapterContent.filter(l => l.lectureId !== lectureId)
        };
      }
      return ch;
    }));
  };

  // Generic handler to update any field in a lecture
  const updateLectureField = (
    chapterId: string, 
    lectureId: string, 
    field: keyof ChapterContent, 
    value: string | number | boolean
  ) => {
    setChapters(chapters.map(ch => {
      if (ch.chapterId === chapterId) {
        return {
          ...ch,
          chapterContent: ch.chapterContent.map(l => 
             l.lectureId === lectureId ? { ...l, [field]: value } : l
          )
        };
      }
      return ch;
    }));
  };

  // --- Final Submit ---
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Prepare data strictly matching your backend expectations
    // Note: We don't include _id, createdAt, etc. as the backend generates them
    const courseData = {
        courseTitle,
        courseDescription,
        coursePrice,
        discount,
        courseContent: chapters.map((ch, index) => ({
            chapterId: ch.chapterId,
            chapterOrder: index + 1,
            chapterTitle: ch.chapterTitle,
            chapterContent: ch.chapterContent.map((l, lIndex) => ({
                ...l,
                lectureOrder: lIndex + 1
            }))
        })),
        educator: "temp-educator-id", // Replace with actual user ID from Auth
        courseThumbnail: image ? image.name : '' // Handle file upload logic here
    };

    console.log("FINAL DATA TO SEND:", courseData);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6'>
        
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>Add New Course</h1>

        <form onSubmit={handleSubmit} className='space-y-8'>
          
          {/* 1. Basic Details Section */}
          <section>
            <h2 className='text-xl font-semibold text-gray-700 border-b pb-2 mb-4'>Course Information</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Course Title</label>
                    <input 
                        type="text" 
                        className='w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none'
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder='e.g. Full Stack React Course'
                        required 
                    />
                </div>

                <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                    <textarea 
                        className='w-full border border-gray-300 rounded p-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none'
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        placeholder='Describe your course...'
                        required
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Price ($)</label>
                    <input 
                        type="number" 
                        min="0"
                        className='w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none'
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Discount (%)</label>
                    <input 
                        type="number" 
                        min="0" max="100"
                        className='w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none'
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                </div>

                <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Course Thumbnail</label>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition'>
                        <input type="file" onChange={handleImageUpload} className='hidden' id="thumb-upload" accept="image/*"/>
                        <label htmlFor="thumb-upload" className='cursor-pointer flex flex-col items-center'>
                             <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <span className='text-gray-600'>{image ? image.name : "Click to upload thumbnail"}</span>
                        </label>
                    </div>
                </div>
            </div>
          </section>

          {/* 2. Curriculum Section */}
          <section>
            <div className='flex items-center justify-between border-b pb-2 mb-4'>
                <h2 className='text-xl font-semibold text-gray-700'>Course Curriculum</h2>
                <button type="button" onClick={addChapter} className='bg-blue-100 text-blue-700 px-4 py-2 rounded font-medium text-sm hover:bg-blue-200'>
                    + Add Chapter
                </button>
            </div>
            
            <div className='space-y-4'>
                {chapters.map((chapter, cIndex) => (
                    <div key={chapter.chapterId} className='border border-gray-200 rounded-md bg-white overflow-hidden'>
                        
                        {/* Chapter Header */}
                        <div className='bg-gray-50 p-4 flex items-center justify-between'>
                            <div className='flex items-center gap-2 flex-1'>
                                <span className='font-bold text-gray-400'>0{cIndex + 1}</span>
                                <input 
                                    type="text" 
                                    value={chapter.chapterTitle} 
                                    onChange={(e) => updateChapterTitle(chapter.chapterId, e.target.value)}
                                    className='bg-transparent font-semibold text-gray-800 outline-none w-full border-b border-transparent focus:border-blue-400'
                                    placeholder='Chapter Title'
                                />
                            </div>
                            <div className='flex items-center gap-3'>
                                <button type="button" onClick={() => addLecture(chapter.chapterId)} className='text-blue-600 text-sm hover:underline'>+ Add Lecture</button>
                                <button type="button" onClick={() => toggleChapterCollapse(chapter.chapterId)} className='text-gray-500'>
                                     <svg className={`w-5 h-5 transition-transform ${chapter.collapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <button type="button" onClick={() => removeChapter(chapter.chapterId)} className='text-red-500 hover:text-red-700'>
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Lecture List */}
                        {!chapter.collapsed && (
                            <div className='p-4 space-y-3 bg-white'>
                                {chapter.chapterContent.map((lecture) => (
                                    <div key={lecture.lectureId} className='flex flex-wrap md:flex-nowrap gap-3 items-end border-b border-gray-100 pb-3 last:border-0'>
                                        
                                        <div className='flex-1 min-w-[200px]'>
                                            <label className='text-xs text-gray-500'>Lecture Title</label>
                                            <input 
                                                type="text" 
                                                value={lecture.lectureTitle}
                                                onChange={(e) => updateLectureField(chapter.chapterId, lecture.lectureId, 'lectureTitle', e.target.value)}
                                                className='w-full border border-gray-300 rounded p-2 text-sm' 
                                            />
                                        </div>

                                        <div className='w-24'>
                                            <label className='text-xs text-gray-500'>Duration (m)</label>
                                            <input 
                                                type="number"
                                                value={lecture.lectureDuration}
                                                onChange={(e) => updateLectureField(chapter.chapterId, lecture.lectureId, 'lectureDuration', Number(e.target.value))}
                                                className='w-full border border-gray-300 rounded p-2 text-sm'
                                            />
                                        </div>

                                        <div className='flex-1 min-w-[200px]'>
                                            <label className='text-xs text-gray-500'>File URL (Demo)</label>
                                            <input 
                                                type="text"
                                                value={lecture.lectureUrl}
                                                onChange={(e) => updateLectureField(chapter.chapterId, lecture.lectureId, 'lectureUrl', e.target.value)}
                                                placeholder='https://...'
                                                className='w-full border border-gray-300 rounded p-2 text-sm' 
                                            />
                                        </div>

                                        <div className='flex items-center pb-2'>
                                            <input 
                                                type="checkbox" 
                                                checked={lecture.isPreviewFree}
                                                onChange={(e) => updateLectureField(chapter.chapterId, lecture.lectureId, 'isPreviewFree', e.target.checked)}
                                                className='mr-2'
                                            />
                                            <span className='text-sm text-gray-600'>Free Preview</span>
                                        </div>

                                        <button 
                                            type="button" 
                                            onClick={() => removeLecture(chapter.chapterId, lecture.lectureId)} 
                                            className='text-red-500 pb-2 hover:bg-red-50 p-2 rounded'
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                                {chapter.chapterContent.length === 0 && (
                                    <p className='text-sm text-gray-400 italic text-center py-2'>No lectures in this chapter yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
             <button type="submit" className='bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition'>
                PUBLISH COURSE
             </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddCourse;