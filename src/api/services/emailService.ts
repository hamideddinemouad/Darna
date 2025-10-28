import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";


type Authobject  = {
    user : string,
    pass : string,
    }
    
type Communication = {
    from: string,
    to: string,
    subject : string,
    text : string,
}
class Emailservice {
    serviceProvider : string;
    auth : Authobject;
    transporter : Transporter;

    constructor (serviceProvider : string, auth : Authobject){
        this.serviceProvider = serviceProvider;
        this.auth = auth;
    this.transporter = nodemailer.createTransport({service : this.serviceProvider, auth : this.auth});
    }
    public async send(mailInfos : Communication){
        try {
             const infos =  await this.transporter.sendMail(mailInfos);
             return {success : "an email has been sent with the 2FA code check your email adress"};
        } catch (err : any) {
            throw new Error(err);
        }
    }

}

export { Emailservice};
export type {Authobject, Communication};