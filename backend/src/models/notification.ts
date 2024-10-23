import mongoose, { Document, Model, Mongoose, Schema} from "mongoose"


export interface iNotification extends Document{
    title : string;
    message : string;
    status : string;
    userId : string;
}

const notificationSchema = new Schema<iNotification>({
    title:{
        type : String,
        required : true
    },message:{
        type : String,
        required : true
    },
    status: {
        type : String,
        required : true,
        default:'unread',
    },
    userId:{
        type: String,
        required:true
    }
},{timestamps:true});

const notificationModel :Model<iNotification>= mongoose.model('udemy-notification',notificationSchema);
export default notificationModel;