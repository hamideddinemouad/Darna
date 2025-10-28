import { Emailservice } from "./emailService.ts";
import type { Authobject, Communication } from "./emailService.ts";
import User from "../../models/userModel.ts";


class Twofaservice {

    userEmail : string;
    emailAuth : Authobject;
    emailProvider : string;
    constructor (userEmail = ""){
        this.emailAuth = {
            user : process.env.EMAIL_ADRESS || "" ,
            pass : process.env.EMAIL_PASSWORD || ""
        }
        this.emailProvider = process.env.EMAIL_SERVICE_PROVIDER || "";
        this.userEmail = userEmail || "";
    }

    public generateCode(){
        const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
        return randomSixDigit.toString();
    }

    public send2Fa(twoFactorCode : string){
        const emailTitle = "2FA VERIFICATION ---- DARNA PLATFORM";
        const emailContent = 
        `You tried to log in into DARNA and 2FA is enabled in your account here is your one time code ${twoFactorCode}`;
        const mailToSend : Communication = {from : this.emailAuth.user, 
            to : this.userEmail, 
            subject : emailTitle, 
            text : emailContent};

        const email = new Emailservice("gmail", this.emailAuth);
        email.send(mailToSend);
    }
    public async check2Fa (payload : {email : string, twoFa : boolean}, code : string){
        const user = await User.findOne({email : payload.email});
        if (!user){
            return {error : `user with ${payload.email} was not found or an unknown error occured with user model`}
        }
        if(user.twofactorcode === code){
            return false;
        }
        return true;
    }
}

export default Twofaservice;