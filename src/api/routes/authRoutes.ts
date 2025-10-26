import {Router} from "express";
import Authcontroller from "../controllers/authController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";

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
        this.router.get("/2fa/toggle", authmiddleware.isLoggedIn.bind(authmiddleware), Authcontroller.buildToggle2Fa.bind(Authcontroller));
        this.router.post("/login/2fa", authmiddleware.verifyPartialLogIn.bind(authmiddleware), Authcontroller.buildCheck2Fa.bind(Authcontroller)) ;

    }
}

export default Authroutes;
