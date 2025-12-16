import React, { useState, type ChangeEvent } from 'react';

import type { ChapterContent } from '../../../models/course.model.js';
import { uploadMedia } from '../../../utils/utils.js';
import { UploadCloud, Video, X } from 'lucide-react';

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
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadProgress(0);
            onUploadStart();

            const uploadedKey = await uploadMedia(file, (percent) => {
                setUploadProgress(percent);
            });

            console.log("Uploaded key:", uploadedKey);

            if (uploadedKey) {
                onUpdate(chapterId, lecture.lectureId, 'lectureUrl', uploadedKey);
            } else {
                alert("Upload failed (No key returned)");
            }
            
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed, please try again.");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            onUploadFinish();
        }
    };

    const getFileName = (url: string) => {
        if (!url) return '';

        const parts = url.split('-');
        if (parts.length > 1) {
            return parts.slice(1).join('-'); 
        }
        return url.split('/').pop() || 'File Uploaded';
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
                <label className='text-xs text-gray-500 flex justify-between'>
                    <span>Video Content</span>
                    {isUploading && <span className='text-blue-600 font-bold'>{uploadProgress}%</span>}
                </label>
                
                {isUploading ? (
                     <div className='w-full h-9 bg-gray-100 rounded border border-gray-200 flex items-center px-2 relative overflow-hidden'>
                        <div 
                            className='absolute left-0 top-0 bottom-0 bg-blue-100 transition-all duration-300' 
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                        <span className='relative z-10 text-xs text-blue-800 font-medium flex items-center gap-2'>
                            <UploadCloud size={14} className="animate-bounce"/> Uploading...
                        </span>
                     </div>
                ) : (
                    <div className='flex gap-2 items-center'>
                        {!lecture.lectureUrl ? (
                        <input 
                            type="file"
                            accept="video/*,application/pdf"
                            onChange={handleFileChange}
                            className='w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer' 
                        />
                        ) : (
                            <div className='flex items-center justify-between w-full border border-green-200 bg-green-50 rounded px-3 py-2'>
                                <div className='flex items-center gap-2 overflow-hidden'>
                                    <Video size={16} className="text-green-600 shrink-0" />
                                    <span className='text-xs text-green-700 font-medium truncate'>
                                        {getFileName(lecture.lectureUrl)}
                                    </span>
                                </div>
                                <button
                                    type="button" 
                                    onClick={() => onUpdate(chapterId, lecture.lectureId, 'lectureUrl', '')}
                                    className='text-gray-400 hover:text-red-500 transition'
                                    title="Remove file"
                                >
                                    <X size={16} />
                                </button>
                            </div>
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

            {/* Remove Lecture Button */}
            <button 
                type="button" 
                onClick={() => onRemove(chapterId, lecture.lectureId)} 
                className='text-red-500 pt-4 hover:bg-red-50 p-2 rounded transition'
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default LectureItem;