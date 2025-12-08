import axios from 'axios';

export const uploadFileToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary config missing. Check .env file.");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
            // Optional: Track upload progress here if you want to pass a callback later
        }
    );

    return response.data.secure_url;
};