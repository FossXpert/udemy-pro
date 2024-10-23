import mongoose, { Document, Schema, Model, ObjectId, Types } from "mongoose";
import { iUser } from "./user";
import { iCategory } from "./category";


export interface iComment extends Document {
    user: iUser;
    question: string;
    questionReplies?: iComment[]; // Learn Optional Chaining
}
export interface iReview extends Document {
    user: iUser;
    rating: number;
    comment: string;
    commentReplies?: iComment[];
}
export interface iLink extends Document {
    title: string;
    url: string;
}
export interface courseDataInside extends Document {
    videoUrl: string;
    title: string;
    description: string;
}
export interface iCourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    // links: iLink[];
    courseDataInside: courseDataInside[];
    suggestion: string;
    questions: iComment[];
}

export interface iCourse extends Document {
    name: string;
    description?: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: iReview[];
    courseData: iCourseData[];
    ratings?: number;
    purchased?: number;
    postedBy?: {
        userId: Types.ObjectId;
        name: string;
        email: string;
    }
    isPublished?: boolean;
    courseCategory?: Types.ObjectId;
}


const reviewSchema = new Schema<iReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentReplies: [Object]
});
const linkSchema = new Schema<iLink>({
    title: String,
    url: String,
});

const courseDataInsideSchema = new Schema<courseDataInside>({
    videoUrl: String,
    title: String,
    description: String,
});

const commentSchema = new Schema<iComment>({
    user: Object,
    question: String,
    questionReplies: [Object],
});
const courseDataSchema = new Schema<iCourseData>({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    // links: [linkSchema],
    courseDataInside: [courseDataInsideSchema],
    suggestion: String,
    questions: [commentSchema],
});
const courseSchema = new Schema<iCourse>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    estimatedPrice: {
        type: Number,
    },
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    tags: {
        type: String, required: false
    },
    level: {
        type: String, required: true
    },
    demoUrl: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
    postedBy: {
        userId: {
            type: Types.ObjectId, ref: 'udemy-users',
        },
        email: String,
        name: String
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    courseCategory: [
        {
            type: Schema.Types.ObjectId, ref: 'udemy-category'
        }
    ]

}, { timestamps: true });
const courseModel: Model<iCourse> = mongoose.model('udemy-course', courseSchema);
export default courseModel;
