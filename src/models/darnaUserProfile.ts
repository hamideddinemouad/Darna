import mongoose, { Schema } from 'mongoose';

interface DarnaUserProfileProps {
  globalUserId: string; 
  email: string;
  
  abonnement: 'gratuit' | 'pro' | 'premium';
  annoncesCreees: number;
  annoncesActives: number;
  kycEntrepriseValide: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const DarnaUserProfileSchema = new Schema<DarnaUserProfileProps>(
  {
    globalUserId: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    
    email: { 
      type: String, 
      required: true 
    },
    
    abonnement: { 
      type: String, 
      enum: ['gratuit', 'pro', 'premium'], 
      default: 'gratuit' 
    },
    
    annoncesCreees: { 
      type: Number, 
      default: 0 
    },
    
    annoncesActives: { 
      type: Number, 
      default: 0 
    },
    
    kycEntrepriseValide: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true,
    collection: 'darna_users_profiles'
  }
);

const DarnaUserProfile = mongoose.model<DarnaUserProfileProps>(
  'DarnaUserProfile', 
  DarnaUserProfileSchema
);

export default DarnaUserProfile;
export type { DarnaUserProfileProps };