export interface Course {
    _id: string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: number;
    isPublished: boolean;
    discount: number;
    courseContent: {
        chapterId: string;
        chapterOrder: number;
        chapterTitle: string;
        chapterContent: {
            lectureId: string;
            lectureTitle: string;
            lectureDuration: number;
            lectureUrl: string;
            isPreviewFree: boolean;
            lectureOrder: number;
        }[];
    }[];
    educator: string;
    enrolledStudents: string[];
    courseRatings: {
        userId: string;
        rating: number;
        _id: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    courseThumbnail: string;
}