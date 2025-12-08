import React, { useState, type ChangeEvent } from 'react';

import type { ChapterContent } from '../../../models/course.model.js';
import { uploadFileToCloudinary } from '../../../utils/utils.js';

interface LectureItemProps {
    chapterId: string;
    lecture: ChapterContent;
    onUpdate: (chapterId: string, lectureId: string, field: keyof ChapterContent, value: any) => void;
    onRemove: (chapterId: string, lectureId: string) => void;
    onUploadStart: () => void;
    onUploadFinish: () => void;
}

const LectureItem: React.FC<LectureItemProps> = ({ chapterId, lecture, onUpdate, onRemove, onUploadStart, onUploadFinish }) => {
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            onUploadStart(); 

            const downloadUrl = await uploadFileToCloudinary(file);

            onUpdate(chapterId, lecture.lectureId, 'lectureUrl', downloadUrl);
            
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed, please try again.");
        } finally {
            setIsUploading(false);
            onUploadFinish();
        }
    };

    return (
        <div className='flex flex-wrap md:flex-nowrap gap-3 items-center border-b border-gray-100 pb-3'>
            <div className='flex-1 min-w-[200px]'>
                <label className='text-xs text-gray-500'>Title</label>
                <input 
                    type="text" 
                    value={lecture.lectureTitle} 
                    onChange={(e) => onUpdate(chapterId, lecture.lectureId, 'lectureTitle', e.target.value)} 
                    className='w-full border border-gray-300 rounded p-2 text-sm' 
                />
            </div>

            {/* Duration */}
            <div className='w-24'>
                <label className='text-xs text-gray-500'>Duration</label>
                <input 
                    type="number" 
                    value={lecture.lectureDuration} 
                    onChange={(e) => onUpdate(chapterId, lecture.lectureId, 'lectureDuration', Number(e.target.value))} 
                    className='w-full border border-gray-300 rounded p-2 text-sm'
                />
            </div>

            {/* File Upload (Smart Input) */}
            <div className='flex-1 min-w-[200px]'>
                <label className='text-xs text-gray-500'>
                    {isUploading ? <span className='text-blue-600'>Uploading...</span> : lecture.lectureUrl ? <span className='text-green-600'>✓ Content Uploaded</span> : 'Video/PDF File'}
                </label>
                
                {/* If uploading, show progress bar or spinner. If done, show "Change File" */}
                {isUploading ? (
                     <div className='w-full h-9 bg-gray-100 rounded border border-gray-200 flex items-center px-2'>
                        <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span className='text-xs text-gray-500'>Please wait...</span>
                     </div>
                ) : (
                    <div className='flex gap-2'>
                        <input 
                            type="file"
                            accept="video/*,application/pdf"
                            onChange={handleFileChange}
                            className='w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700' 
                        />
                        {lecture.lectureUrl && (
                             <a href={lecture.lectureUrl} target="_blank" rel="noreferrer" className='text-blue-500 text-xs underline flex items-center'>View</a>
                        )}
                    </div>
                )}
            </div>

            {/* Free Preview Toggle */}
            <div className='flex items-center pt-4'>
                <input 
                    type="checkbox" 
                    checked={lecture.isPreviewFree} 
                    onChange={(e) => onUpdate(chapterId, lecture.lectureId, 'isPreviewFree', e.target.checked)} 
                    className='mr-2'
                />
                <span className='text-sm text-gray-600'>Free</span>
            </div>

            {/* Remove Button */}
            <button 
                type="button" 
                onClick={() => onRemove(chapterId, lecture.lectureId)} 
                className='text-red-500 pt-4 hover:bg-red-50 p-2 rounded'
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export default LectureItem;