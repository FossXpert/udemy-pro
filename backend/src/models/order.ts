import mongoose, { Document, Model, Schema } from "mongoose";

export interface iOrder extends Document{
    courseId : string;
    userId : string;
    payment_info? : object;
    createdAt? : Date;
    updatedAt? : Date;
}
const orderSchema = new Schema<iOrder>({
   courseId : {
    type : String,required : true,
   },
   userId : {
    type : String,required : true,
   },
   payment_info : {
    type: Object,
   },
   createdAt : {
    type : Date,
   },
   updatedAt : {
    type : Date,
   }
},{timestamps : true});

const orderModel : Model<iOrder> = mongoose.model('udemy-order',orderSchema);
export default orderModel; 