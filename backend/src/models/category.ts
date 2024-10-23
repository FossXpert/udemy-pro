import mongoose, {ObjectId, Schema, Types} from 'mongoose'


export interface iCategory extends Document {
    _id : Types.ObjectId;
    categoryName: string;
    containedCourses?: Types.ObjectId[];
}
export interface ICategory extends Document {
    type:string
    categories : iCategory[]
}

const categoriesSchema = new Schema<iCategory>({
    categoryName: { type: String },
    _id : { type: Schema.Types.ObjectId},
    containedCourses : [{ type: Schema.Types.ObjectId, ref : 'udemy-courses'}]
})

const CategoriesSchema = new Schema<ICategory>({
    type : {
        type :String
    },
    categories : [categoriesSchema]
})
const categoryModel = mongoose.model<ICategory>('udemy-category',CategoriesSchema);
export default categoryModel;