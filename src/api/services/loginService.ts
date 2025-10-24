import User from "../../models/userModel.ts";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import  Jwt  from "jsonwebtoken";

class Loginservice{
    email : string;
    password : string;
    
    constructor(email : string, password : string){
        this.email = email;
        this.password = password;
    }
    async login(){
        const user = await User.findOne({email : this.email});
        if(!user){
            return {error : "Incorrect Email or password"}
        }
        if (!await bcrypt.compare(this.password, user.password || '')){
            
            return {error : "Incorrect Email or password"};
        }
        const token = Jwt.sign(this.email, process.env.SECRET_KEY || '');
        return {sucess : "logged in", token : token};

    }
}

export default Loginservice;