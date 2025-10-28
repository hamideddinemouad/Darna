import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        firstname :{
            type : String,
            required : true
        },

        lastname :{
            type : String,
            required : true
        },

        email :{
            type : String,
            required : true,
            unique: true
        },

        password:{
            type: String,
            required : true,
            minlength : 6
        },
        role:{
            type : String,
            default : "user"
        },

        verified : {
            type : Boolean,
            default : false
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
}
);
const User = mongoose.model('User', userSchema);

export default User;