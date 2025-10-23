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

        const authmiddleware : Authmiddleware = new Authmiddleware();

        this.router.post("/register", authmiddleware.verifyRegisterInfos.bind(authmiddleware), Authcontroller.buildRegister.bind(Authcontroller));
        this.router.post("/login", authmiddleware.verifyLoginInfos.bind(authmiddleware), Authcontroller.buildLogin.bind(Authcontroller)) ;
    }
}

export default Authroutes;
