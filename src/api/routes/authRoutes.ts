<<<<<<< HEAD
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
=======
import { Router } from 'express';
import AuthController from '../controllers/authController.js';

export default class AuthRoutes {
  public router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/register', this.controller.register.bind(this.controller));
    this.router.post('/login', this.controller.login.bind(this.controller));
  }

  public getRouter(): Router {
    return this.router;
  }
}
>>>>>>> 8eeb06846401c227e5001c3d029fc3342c29f2a5
