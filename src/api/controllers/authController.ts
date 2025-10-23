import type { Request, Response } from "express";
import User from "../../models/userModel.ts";
// import type { IUser } from "../../models/userModel.ts";
import Registerservice from "../services/registerService.ts";
import Loginservice from "../services/loginService.ts";

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
    public async login(res : Response){
        try{
            const loginservice : Loginservice = new Loginservice(
                this.email, 
                this.password,);
            
            res.status(200).json(await loginservice.login());
        }catch(err){
            res.status(500).json({error : err});
        }
    }
    public async register(res : Response){
        const user = await User.findOne({email : this.email});
        if(await User.findOne({email : this.email})){
            res.status(409).json({error : "already registered"});
            return
        }
        const registerservice : Registerservice = new Registerservice(
            this.email, 
            this.password, 
            this.firstName, 
            this.lastName);
        
        await registerservice.register();
        res.status(201).json({success : "Registered successfuly"});
    }
    static buildRegister(req : Request, res : Response){

        const instance : AuthController = new AuthController(
            req.body["email"], 
            req.body["password"],
            req.body["first-name"], 
            req.body["last-name"])
        
        instance.register(res);
    }
    static buildLogin(req : Request, res : Response){

        const instance : AuthController = new AuthController(
            req.body["email"], 
            req.body["password"],
        )
        
        instance.login(res);
    }
}

export default AuthController;


