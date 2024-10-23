require('dotenv').config();
import mongoose, { Document,Schema,Model, ObjectId, Types} from "mongoose";
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { iCourse } from "./course";

const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface iUser extends Document {
    name : string;
    email : string;
    password : string;
    avatar : {
        public_id : string;
        url : string;
    };
    role: string;
    isVerified: boolean;
    purchased: number;
    courses: Array<{courseId: string}>;
    comparePassword: (password: string) => Promise<boolean>;
    signRefreshToken: () => string;
    signAccessToken: () => string;
    createdAt: Date;
    postedCourse? : Types.ObjectId[];
}

const userSchema = new Schema<iUser>({
    name : {
        type : String,
        required : [true, 'Please enter your name'],
    },
    email : {
        type : String,
        required : [true, 'Please enter your email'],
        unique : true,
        validate:{
            validator:function(value:string){
                return emailRegexPattern.test(value);
            }
        },
        message : 'Please enter a valid email'
    },
    purchased:{type:Number,default:0},
    password : {
        type : String,
        required : [false, 'Please enter your password'],
        minlength : [6, 'Your password must be at least 6 characters long'],
        select : false
    },
    avatar:{
        public_id:{
            type : String,
            required : false,
        },
        url:{
            type : String,
            required : false,
        }
    },
    role:{
        type : String,
        default : 'admin',
    },
    isVerified:{
        type : Boolean,
        default : false,
    },
    courses:[
        {
            courseId : String,
        }
    ],
    postedCourse:[
        {
            type : Types.ObjectId, ref : 'udemy-course'
        }
    ]

},{timestamps : true});


//Bcrypting Password - Remember
userSchema.pre<iUser>('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(enteredPassword:string){
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.signAccessToken = async function(){
    const token = jwt.sign({id:this._id},process.env.ACCESS_TOKEN as Secret,{
        expiresIn:'5m'
    })
    return token;
};

userSchema.methods.signRefreshToken = async function(){
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN as Secret,{
        expiresIn : '3d'
    })
}

export const userModel : Model<iUser> = mongoose.model<iUser>('udemy-user', userSchema);
