import {Router} from "express";
import Authcontroller from "../controllers/authController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import type { Request, Response } from "express";
import passport from "passport";
import { googleAuth, googleAuthCallback, protectRoute } from "../controllers/SSOController.ts";

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
		this.router.get('/profile', protectRoute, (req: Request, res: Response) => {
			
			const user = (req as any).user;
			res.status(200).json({profile: user })
		});

	}
}

export default Authroutes;
