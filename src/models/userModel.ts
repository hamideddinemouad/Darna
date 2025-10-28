import mongoose from "mongoose";

export enum UserRole {
    PARTICULIER = "Particulier",
    ENTREPRISE = "Entreprise",
    ADMIN = "Admin"
}

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.PARTICULIER
        },
        verified: {
            type: Boolean,
            default: false
        },
        authProvider: {
            type: String,
            enum: ['local', 'google'],
            default: 'local'
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, 
        },
        twofactorauth :{
            type : Boolean,
            default : false
        },
        twofactorcode: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;