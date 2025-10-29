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

    constructor(email = "", password = "", firstName = "",  lastName = ""){
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public async login(res : Response){
        const loginservice : Loginservice = new Loginservice(
            this.email, 
            this.password);
    
        res.json(await loginservice.login());
    }

    public async login2fa(req : Request, res : Response){
        const loginService = new Loginservice();
        res.json(await loginService.login2Fa(res.locals.payload, req.body.code));
    }

    public async toggle2Fa(req : Request, res : Response){
        const user = await User.findOne({email : this.email});
        let twoFastatus : boolean;
        if (!user){
            return {error : `user with ${this.email} was not found or an unknown error occured with user model`}
        }
        if (user.twofactorauth){
            user.twofactorauth = false;
            twoFastatus = false;
        }
        else {
            user.twofactorauth = true;
            twoFastatus = true;
        }
        await user.save();
        const message = twoFastatus ? {success : "2FA ENABLED"} : {success : "2FA DISABLED"};
        res.status(200).json(message);
        return;
    }
    public async register(res : Response){
        const user = await User.findOne({email : this.email});
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
        res.json({success : "Registered successfuly"});
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
    static buildToggle2Fa(req : Request, res : Response){
        const instance : AuthController = new AuthController(res.locals.payload.email);
        return instance.toggle2Fa(req, res);
    }
    static buildCheck2Fa (req : Request, res : Response){
        const instance : AuthController = new AuthController();
        return instance.login2fa(req, res);
    }
}

export default AuthController;


