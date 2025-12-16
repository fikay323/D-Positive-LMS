import axios from 'axios';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

const R2_DOMAIN = import.meta.env.VITE_R2_PUBLIC_DOMAIN;

export const getSecureUrl = async (fileKey: string): Promise<string | null> => {
    try {
        if (!fileKey) return null;

        if (fileKey.startsWith('http')) return fileKey;

        if (!R2_DOMAIN) {
            console.error("Missing VITE_R2_PUBLIC_DOMAIN in .env");
            return null;
        }

        const cleanKey = fileKey.startsWith('/') ? fileKey.slice(1) : fileKey;
        return `${R2_DOMAIN}/${cleanKey}`;

    } catch (error) {
        console.error("Failed to construct URL:", error);
        return null;
    }
};

export const uploadMedia = async (file: File, onProgress?: (percent: number) => void): Promise<string | null> => {
    try {
        // return await uploadImageToCloudinary(file);
        if (file?.type?.startsWith('image/')) {
            return await uploadImageToCloudinary(file);
        }
        else if (file?.type?.startsWith('video/')) {
            return await uploadVideoToR2(file, onProgress);
        }
        else {
            return await uploadVideoToR2(file, onProgress);
        }
    } catch (error) {
        console.error("Upload failed:", error);
        return null;
    }
};

const uploadImageToCloudinary = async (file: File): Promise<string> => {
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
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data.secure_url;
};


const uploadVideoToR2 = async (file: File, onProgress?: (percent: number) => void): Promise<string> => {
    const { data } = await axios.post('/api/sign-url', {
        fileName: file.name,
        fileType: file.type
    });

    const { uploadUrl, key } = data;

    await axios.put(uploadUrl, file, {
        headers: {
            'Content-Type': file.type
        },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percent);
            }
        }
    });

    return key;
};