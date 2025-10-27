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

    public isLoggedIn(req : Request, res : Response, next : NextFunction) {
        if (!req.headers.authorization){
            res.json({error : "no authorization provided"});
            return
        }
        const token : string = req.headers.authorization?.split(" ")[1] || "";
        // res.json(token);
        if(token){
            try {
                const payload = Jwt.verify(token, this.secretKey) as {email : string, twoFa : boolean};
                if (payload.twoFa){
                    res.json({error : "you need to continue 2FA process in api/auth/login/2FA or start a new one in api/auth/login"});
                    return
                }
                res.locals.payload = payload;
                next();
                return
                // res.json("ran");
            } catch (error) {
                res.json({errorEx : "invalid token user not logged in", jwtverifyerr : error, tokenprovided : token});
                return;
            }
        }
    }
    public verifyPartialLogIn (req : Request, res : Response, next : NextFunction){
        if (!req.headers.authorization){
            res.json({error : "no authorization provided"});
            return
        }
        const token : string = req.headers.authorization?.split(" ")[1] || "";

        if(token){
            try {
                const payload = Jwt.verify(token, this.secretKey) as {email : string, twoFa : boolean};
                res.locals.payload = payload;
                next();
                return
                // res.json("ran");
            } catch (error) {
                res.json({errorEx : "invalid token user not logged in", jwtverifyerr : error, tokenprovided : token});
                return;
            }
        }
    }
    public verifyLoginInfos(req : Request, res : Response, next : NextFunction){
        if (!req.body){
            res.status(400).json({error : "request body empty"});
            return
        }
        if(!req.body["email"] || !req.body["password"]){
            res.status(400).json({error : "all fields are required"});
            return
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
    public verifyRegisterInfos(req : Request, res : Response, next : NextFunction) : void{
        if (!req.body){
            res.status(400).json({error : "request body empty"});
            return
        }
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
