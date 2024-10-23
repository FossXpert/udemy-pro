import mongoose from "mongoose";
require('dotenv').config();

const connectionString : string = process.env.MONGO_URI || '';

const connectDB = async() => {
    try {
        await mongoose.connect(connectionString);
    } catch (error:any) {
        console.log(error.message)
    }
}


mongoose.connection.on('connected',()=>{
    console.log("MongoDB Connected")
})
mongoose.connection.on('disconnected',()=>{
    console.log("MongoDB Disconnected")
})
mongoose.connection.on('error',() => {
    console.log("Error in MongoDB Connection")
})

export default connectDB;

