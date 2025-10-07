import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { enVars } from "../config/env";

export const checkAuth = (...authRoles: string[])=>(req: Request, res: Response, next: NextFunction) =>{
    try{
        const accessToken = req.headers.authorization;

        if(!accessToken){
            throw new AppError(403, "No Token Received")
        }

        const verifiedToken= verifyToken(accessToken, enVars.JWT_ACCESS_SECRET)as JwtPayload;
        console.log(verifiedToken)
      
        if(!authRoles.includes(verifiedToken.role)){
            throw new AppError(403, "You are not permitted to view this route !!!")
        }
        req.user= verifiedToken;
        next()
    }catch(error){
        next(error);
    }
};