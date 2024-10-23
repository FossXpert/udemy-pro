import { Request } from "express";
import { iUser } from "../models/user";
import cloudinary from 'cloudinary';

declare global {
    namespace Express{
        export interface jwtPayloadNeww extends Request {
            user : iUser
        }
    }
}


// cloudinary.js

