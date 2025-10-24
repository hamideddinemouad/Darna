import type { Transporter } from "nodemailer"
import nodemailer from "nodemailer"
import type { Request,Response } from "express"

type Authobject  = {
    user : string,
    pass : string,
    }
type Mailoptions = {
    from: string,
    to: string,
}
type Communication = {
    subject: string,
    text: string
}
class Emailservice {
    serviceProvider : string;
    auth : Authobject;
    // options : Mailoptions;
    tranporter : Transporter;

    constructor (serviceProvider : string, auth : Authobject){
        this.serviceProvider = serviceProvider;
        this.auth = auth;
        // this.options = options;
        this.tranporter = nodemailer.createTransport({service : this.serviceProvider, auth : this.auth});
    }
    public send(res : Response){
        res.json(this.tranporter);
    }
}

export { Emailservice};
export type {Authobject, Mailoptions, Communication};