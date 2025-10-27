<<<<<<< HEAD
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
=======
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export default class AuthMiddleware {
  
  public authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as any;
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }

  public authorize(...allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
      }

      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({ 
          message: 'Access denied',
          yourRole: req.user.role,
          allowedRoles: allowedRoles
        });
        return;
      }

      next();
    };
  }
}
>>>>>>> 8eeb06846401c227e5001c3d029fc3342c29f2a5
