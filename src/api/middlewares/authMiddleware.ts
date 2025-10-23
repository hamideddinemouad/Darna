import { error } from "console";
import type {NextFunction ,Request, Response } from "express";
import  Jwt  from "jsonwebtoken";

class Authmiddleware{
    secretKey  : string;

    constructor(){
        this.secretKey = process.env.SECRET_KEY || "";
        if (!this.secretKey){
            throw new Error("secret key missing");
        }
    }
    // public isLoggedIn(req : Request, res : Response) {
    //     const token : string = req.headers.authorization?.split(" ")[1] || "";
    //     if(token){
    //         try {
    //             Jwt.verify(token, this.secretKey);
    //         } catch (error) {
    //             res.json(error);
    //         }
    //     }
    // }
    public verifyRegisterInfos(req : Request, res : Response, next : NextFunction) : void{
        if(!req.body["first-name"] || !req.body["last-name"] || !req.body["password"] || !req.body["email"]){
            res.status(400).json({error : "all fields are required"});
            return;
        }
        const emailRegex : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValidation : boolean = emailRegex.test(req.body.email);
        if(!emailValidation){
            res.status(400).json({error : "email is invalid"});
            return;
        }
        next();
        return;
    }
}
export default Authmiddleware;