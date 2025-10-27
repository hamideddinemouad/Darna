<<<<<<< HEAD
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
=======
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Particulier', 'Entreprise', 'Admin'],
    default: 'Particulier'
  },
  firstName: String,
  lastName: String,
  phone: String
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
>>>>>>> 8eeb06846401c227e5001c3d029fc3342c29f2a5
