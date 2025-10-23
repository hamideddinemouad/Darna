import type { Request, Response } from "express";
import User from "../../models/userModel.ts";
import Registerservice from "../services/registerService.ts";

class AuthController{
    firstName : string;
    lastName : string;
    email : string;
    password : string;

    constructor(email : string, password : string, firstName = "",  lastName = ""){
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public async register(req: Request, res : Response){

        if(await User.findOne({email : this.email})){
            res.json({error : "already registered"});
            return
        }
        const registerservice : Registerservice = new Registerservice(
            this.email, 
            this.password, 
            this.firstName, 
            this.lastName);
        
        await registerservice.register();
    }
    static build(req : Request, res : Response){

        const instance : AuthController = new AuthController(
            req.body["email"], 
            req.body["password"],
            req.body["first-name"], 
            req.body["last-name"])
        
        instance.register(req, res);
    }


}

export default AuthController;


