import { error } from "console";
import type {NextFunction ,Request, Response } from "express";
import  Jwt  from "jsonwebtoken";
import passport from "passport";

class Authmiddleware{
    secretKey  : string;

    constructor(){
        this.secretKey = process.env.SECRET_KEY || "";
        if (!this.secretKey){
            throw new Error("secret key missing");
        }
    }
    public isLoggedIn(req : Request, res : Response, next : NextFunction) {
        const token : string = req.headers.authorization?.split(" ")[1] || "";
        if(token){
            try {
                Jwt.verify(token, this.secretKey);
            } catch (error) {
                res.json(error);
                return;
            }
        }
        next();
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

    public protectRoute(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate(
            'jwt',
            { session: false },
            (err: any, user: any) => {
                if (err) return next(err);

                if (!user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }

                (req as any).user = user;
                next();
            }
        )(req, res, next);
    }
}
export default Authmiddleware;