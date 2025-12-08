export type CreateCourseData = Omit<Course, '_id' | '__v'>;

export interface Course {
    _id: string;
    courseTitle: string;
    courseDescription: string;
    coursePrice: number;
    isPublished: boolean;
    discount: number;
    courseContent: CourseLecture[];
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

export interface CourseLecture {
    chapterId: string;
    chapterOrder: number;
    chapterTitle: string;
    chapterContent: ChapterContent[];
}

export interface ChapterContent {
    lectureId: string;
    lectureTitle: string;
    lectureDuration: number;
    lectureUrl: string;
    isPreviewFree: boolean;
    lectureOrder: number;
}