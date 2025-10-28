import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { authService } from '../services/authService.ts';

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const googleUser: any = req.user;

        const { user, token } = await authService.handleGoogleUser(googleUser);

        return res.status(200).json({
            message: 'Google authentication success',
            token,
            profile: authService.buildPublicProfile(user),
        });
    } catch (err) {
        next(err);
    }
};

export { googleAuth, googleAuthCallback };
