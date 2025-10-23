import User from "../../models/userModel.ts";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

class Registerservice{
    firstName : string;
    lastName : string;
    email : string;
    password : string;
    
    constructor(email : string, password : string, firstName : string,  lastName : string){
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    public async register(){
        const hashedPassword  : string = await bcrypt.hash(this.password, 10);
        // res.json(hashedPassword);
        await User.insertOne({
            firstname : this.firstName, 
            lastname : this.lastName, 
            email : this.email, 
            password : hashedPassword});
    }
}

export default Registerservice;