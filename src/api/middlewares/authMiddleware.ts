import type { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import passport from "passport";

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    twoFa: boolean;
}

class Authmiddleware {
    secretKey: string;

    constructor() {
        this.secretKey = process.env.JWT_SECRET || "";
        if (!this.secretKey) {
            throw new Error("secret key missing");
        }
    }

    public isLoggedIn(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.status(401).json({ error: "no authorization provided" });
            return;
        }

        const token: string = req.headers.authorization?.split(" ")[1] || "";

        if (token) {
            try {
                const payload = Jwt.verify(token, this.secretKey) as JWTPayload;

                if (payload.twoFa) {
                    res.status(403).json({ 
                        error: "you need to continue 2FA process in api/auth/login/2FA or start a new one in api/auth/login" 
                    });
                    return;
                }

                res.locals.payload = payload;
                next();
                return;
            } catch (error) {
                res.status(401).json({ 
                    error: "invalid token user not logged in", 
                    details: error 
                });
                return;
            }
        } else {
            res.status(401).json({ error: "no token provided" });
            return;
        }
    }

    public verifyPartialLogIn(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.status(401).json({ error: "no authorization provided" });
            return;
        }

        const token: string = req.headers.authorization?.split(" ")[1] || "";

        if (token) {
            try {
                const payload = Jwt.verify(token, this.secretKey) as JWTPayload;
                res.locals.payload = payload;
                next();
                return;
            } catch (error) {
                res.status(401).json({ 
                    error: "invalid token user not logged in", 
                    details: error 
                });
                return;
            }
        } else {
            res.status(401).json({ error: "no token provided" });
            return;
        }
    }

    public verifyLoginInfos(req: Request, res: Response, next: NextFunction) {
        if (!req.body) {
            res.status(400).json({ error: "request body empty" });
            return;
        }
        if (!req.body["email"] || !req.body["password"]) {
            res.status(400).json({ error: "all fields are required" });
            return;
        }
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValidation: boolean = emailRegex.test(req.body.email);

        if (!emailValidation) {
            res.status(400).json({ error: "email is invalid" });
            return;
        }
        next();
        return;
    }

    public verifyRegisterInfos(req: Request, res: Response, next: NextFunction): void {
        if (!req.body) {
            res.status(400).json({ error: "request body empty" });
            return;
        }
        if (!req.body["first-name"] || !req.body["last-name"] || !req.body["password"] || !req.body["email"]) {
            res.status(400).json({ error: "all fields are required" });
            return;
        }
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValidation: boolean = emailRegex.test(req.body.email);
        if (!emailValidation) {
            res.status(400).json({ error: "email is invalid" });
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