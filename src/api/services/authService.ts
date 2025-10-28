import jwt from 'jsonwebtoken';
import User from '../../models/userModel.ts';

class AuthService {
    async handleGoogleUser(googleUser: any) {
        
        const email = googleUser.emails?.[0]?.value;
        
        if (!email) {
            throw new Error('No email found in Google profile');
        }

        const displayName = googleUser.displayName || '';
        const [firstname = 'User', lastname = ''] = displayName.split(' ');

        let user = await User.findOne({ email });

        user ??= await User.create({
            firstname,
            lastname: lastname || firstname,
            email,
            password: `google_${googleUser.id}`,
            authProvider: 'google',
        });

        const JWT_SECRET = process.env.JWT_SECRET || '';

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const token = jwt.sign(
            {
                sub: user._id,
                email: user.email,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            user,
            token,
        };
    }

    buildPublicProfile(user: any) {
        return {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
        };
    }
}

export const authService = new AuthService();
