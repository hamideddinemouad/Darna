import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.ts';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleAuthCallback = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {

	const googleUser: any = req.user;
	if (!googleUser || !googleUser.id) {
		return res.status(400).json({ message: 'Authentication failed: no user' });
	}

    const email = googleUser.emails?.[0]?.value;
    if(!email){
        return res.status(400).json({ messsage: 'No email found in this Google profile'});
    }

    const displayName = googleUser.displayName || '';
    const [firstname = 'User', lastname = ''] = displayName.split(' ');

	try {
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                firstname,
                lastname,
                email,
                password: `google_${googleUser.id}`, 
                role: 'user',
                verified: true,
            });
        }

        const payload = {
            sub: user._id.toString(),
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        });

        return res.status(200).json({ 
            token, 
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error during Google authentication:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const protectRoute = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
		return passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
			if (err) return next(err);
			if (!user) return res.status(401).json({ message: 'Unauthorized' });

			(req as any).user = user;
			return next();
		})(req, res, next);
};