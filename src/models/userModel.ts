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
        twofactorauth :{
            type : Boolean,
            default : false
        },
        twofactorcode :{
            type : String,
            required : false
        }
}
);
const User = mongoose.model('User', userSchema);

export default User;
