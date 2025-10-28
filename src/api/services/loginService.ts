import User from "../../models/userModel.ts";
import bcrypt from "bcrypt";
import  Jwt  from "jsonwebtoken";
import Twofaservice from "./twoFaService.ts";

class Loginservice{
    email : string;
    password : string;
    secretKey : string;
    
    constructor(email = "", password = "" ){
        this.email = email;
        this.password = password;
        this.secretKey = process.env.JWT_SECRET || ""
    }
    async login2Fa(payload : {email : string, twoFa : boolean}, code : string){
        const twoFaService =  new Twofaservice();
        const check = await twoFaService.check2Fa(payload, code);
        if(check){
            // return {check : "ran"}
            return {error : "invalid 2fa code"};
        };
        const modifiedPayload = payload;
        modifiedPayload.twoFa = false;
        const token = Jwt.sign(modifiedPayload, this.secretKey);
        return {success : "logged in using 2fa", token : token};
    }
    async login(){
        const user  = await User.findOne({email : this.email});
        if(!user){
            return {error : "Incorrect Email or password"};
        }
        if (!await bcrypt.compare(this.password, user.password)){
            return {error : "Incorrect Email or password"};
        }
        if(user.twofactorauth){
            const twoFaService = new Twofaservice(this.email);
            const twoFaCode = twoFaService.generateCode();
            user.twofactorcode = twoFaCode;
            await user.save();
            const payload = {email : this.email, twoFa : true};
            const token = Jwt.sign(payload, this.secretKey);
            twoFaService.send2Fa(twoFaCode);
            return {success : `2fa code sent to ${this.email}`,
            token : `token only valid in login/2fa for verification purposes :${token}`};

        }
        const payload = {email : this.email, 
            twoFa : false
        }
        const token = Jwt.sign(payload, this.secretKey);
        return {success : "logged in completely", token : token};
    }
}

export default Loginservice;