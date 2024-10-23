import { Request, Response,NextFunction } from "express";

export const catchAsyncError = 
(theFunc : any) => async(req:Request,res:Response,next:NextFunction) => {
    Promise.resolve(theFunc(req,res,next)).catch(next);
};

export const success = async(statusCode: number) : Promise<boolean> => {
    try{
        if(statusCode >= 200 && statusCode<300){
            return true
        }else{
            return false
        }
    }catch(error:any){
        throw error.message
    }
}