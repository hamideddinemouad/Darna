import User from "../../models/userModel.ts";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import Twofaservice from "./twoFaService.ts";

interface JWTPayload {
    email: string;
    role: string;
    twoFa: boolean;
}

class Loginservice {
    email: string;
    password: string;
    secretKey: string;

    constructor(email = "", password = "") {
        this.email = email;
        this.password = password;
        this.secretKey = process.env.SECRET_KEY || "";
    }

    async login2Fa(payload: JWTPayload, code: string) {
        const twoFaService = new Twofaservice();
        const check = await twoFaService.check2Fa(payload, code);
        if (check) {
            return { error: "invalid 2fa code" };
        }

        const modifiedPayload: JWTPayload = {
            email: payload.email,
            role: payload.role,
            twoFa: false
        };

        const token = Jwt.sign(modifiedPayload, this.secretKey);
        return { success: "logged in using 2fa", token: token };
    }

    async login() {
        const user = await User.findOne({ email: this.email });
        if (!user) {
            return { error: "Incorrect Email or password" };
        }

        if (!await bcrypt.compare(this.password, user.password)) {
            return { error: "Incorrect Email or password" };
        }

        if (user.twofactorauth) {
            const twoFaService = new Twofaservice(this.email);
            const twoFaCode = twoFaService.generateCode();
            user.twofactorcode = twoFaCode;
            await user.save();

            const payload: JWTPayload = {
                email: this.email,
                role: user.role,
                twoFa: true
            };

            const token = Jwt.sign(payload, this.secretKey);
            twoFaService.send2Fa(twoFaCode);

            return {
                success: `2fa code sent to ${this.email}`,
                token: `token only valid in login/2fa for verification purposes :${token}`
            };
        }

        const payload: JWTPayload = {
            email: this.email,
            role: user.role,
            twoFa: false
        };

        const token = Jwt.sign(payload, this.secretKey);
        return { 
            success: "logged in completely", 
            token: token,
            user: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role
            }
        };
    }
}

export default Loginservice;