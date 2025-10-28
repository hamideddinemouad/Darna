import {Router} from "express";
import Authcontroller from "../controllers/authController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import type { Request, Response } from "express";
import passport from "passport";
import { googleAuth, googleAuthCallback } from "../controllers/SSOController.ts";

class Authroutes{

    router : Router;
    
    constructor(){
        this.router = Router();
        this.setupRoutes();
    }
    private setupRoutes() : void{

        const authmiddleware : Authmiddleware = new Authmiddleware();

        this.router.post("/register", authmiddleware.verifyRegisterInfos.bind(authmiddleware), Authcontroller.buildRegister.bind(Authcontroller));
        this.router.post("/login", authmiddleware.verifyLoginInfos.bind(authmiddleware), Authcontroller.buildLogin.bind(Authcontroller)) ;
		
		this.router.get('/google', googleAuth);
		this.router.get('/google/callback', 
			passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failure'}), 
			googleAuthCallback
		);
		
		this.router.get('/google/failure', (req: Request, res:Response) => {
			res.status(401).json({ message: 'Google authentification failed'});
		});

		this.router.get('/profile', authmiddleware.protectRoute, (req: Request, res: Response) => {
			const user = (req as any).user;
			
			if (!user) {
				res.status(404).json({ message: 'User not found' });
				return;
			}
			
			res.status(200).json({ 
				profile: {
					id: user._id,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email,
					role: user.role,
					verified: user.verified,
					authProvider: user.authProvider
				}
			});
        });

	}
}

export default Authroutes;
