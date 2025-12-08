import React, { type ChangeEvent, useState } from 'react';
import uniqid from 'uniqid';
import { uploadFileToCloudinary } from '../../../utils/utils.js';


interface CourseBasicInfoProps {
    courseTitle: string;
    courseDescription: string;
    coursePrice: number;
    discount: number;
    courseThumbnail: string;
    onInfoChange: (field: string, value: any) => void;
    onUploadStart: () => void;
    onUploadFinish: () => void;
}

const CourseBasicInfo: React.FC<CourseBasicInfoProps> = ({ courseTitle, courseDescription, coursePrice, discount, courseThumbnail, onInfoChange, onUploadStart, onUploadFinish }) => {
    const [preview, setPreview] = useState<string>('');

    const handleThumbnailChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        try {
            onUploadStart();
            const url = await uploadFileToCloudinary(file);
            onInfoChange('courseThumbnail', url);
        } catch (error) {
            console.error(error);
            alert("Thumbnail upload failed");
        } finally {
            onUploadFinish();
        }
    };

    return (
        <section className='bg-white border border-gray-200 rounded-lg p-6 mb-8'>
            <h2 className='text-xl font-semibold text-gray-700 border-b pb-2 mb-4'>Course Information</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Course Title</label>
                    <input type="text" className='w-full border border-gray-300 rounded p-2' value={courseTitle} onChange={(e) => onInfoChange('courseTitle', e.target.value)} placeholder='e.g. Full Stack React Course' required />
                </div>

                <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                    <textarea className='w-full border border-gray-300 rounded p-2 h-32' value={courseDescription} onChange={(e) => onInfoChange('courseDescription', e.target.value)} placeholder='Describe your course...' required />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Price ($)</label>
                    <input type="number" min="0" className='w-full border border-gray-300 rounded p-2' value={coursePrice} onChange={(e) => onInfoChange('coursePrice', Number(e.target.value))} />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Discount (%)</label>
                    <input type="number" min="0" max="100" className='w-full border border-gray-300 rounded p-2' value={discount} onChange={(e) => onInfoChange('discount', Number(e.target.value))} />
                </div>

                <div className='col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Course Thumbnail</label>
                    <div className='flex items-start gap-4'>
                        <div className='flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition'>
                            <input type="file" onChange={handleThumbnailChange} className='hidden' id="thumb-upload" accept="image/*"/>
                            <label htmlFor="thumb-upload" className='cursor-pointer flex flex-col items-center'>
                                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className='text-gray-600'>Click to upload thumbnail</span>
                            </label>
                        </div>
                        {(preview || courseThumbnail) && (
                            <img src={preview || courseThumbnail} alt="Preview" className='w-32 h-32 object-cover rounded-md border border-gray-300' />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseBasicInfo;