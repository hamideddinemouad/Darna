import {Router} from "express";
import Authcontroller from "../controllers/authController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import type { Request, Response } from "express";

class Authroutes{

    router : Router;
    
    constructor(){
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes() : void{
        // attach method to router
        const authmiddleware : Authmiddleware = new Authmiddleware();
        // this.router.use(authmiddleware.isLoggedIn.bind(authmiddleware));
        // this.router.post("/", this.login.bind(this));
        this.router.post(
            "/register", 
            authmiddleware.verifyRegisterInfos.bind(authmiddleware), 
            Authcontroller.build.bind(Authcontroller));
        
    }


    public login(req : Request, res : Response):void {

    }
}

export default Authroutes;
