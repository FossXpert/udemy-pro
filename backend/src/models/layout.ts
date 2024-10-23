import mongoose, { Document, Model, Schema } from "mongoose";

export interface FaqItem extends Document {
    question: string;
    answer: string;
}
const faqSchema = new Schema<FaqItem>({
    question: { type: String },
    answer: { type: String },
})

export interface BannerImage extends Document {
    public_id: string;
    url: string;
}

const bannerImageSchema = new Schema<BannerImage>({
    public_id: { type: String },
    url: { type: String }
})

export interface Layout extends Document {
    type: string;
    faq: FaqItem[];
    banner: {
        image: BannerImage;
        title: string;
        subtitle: string;
    };
}
const layOutSchema : Schema<Layout> = new Schema<Layout>({
    type: {
        type: String
    },
    faq: [faqSchema],
    banner: {
        image: bannerImageSchema,
        title: { type: String },
        subtitle: { type: String }
    },
},{timestamps:true});


const layoutModel : Model<Layout> = mongoose.model<Layout>('udemy-Layout', layOutSchema);
export default layoutModel;