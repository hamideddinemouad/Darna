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