import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import type { VerifyCallback } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback';
const JWT_SECRET = process.env.JWT_SECRET || '';

export interface OAuthUser {
  id:string;
  displayName?:string;
  emails?: Array<{ value?: string}>;
  provider?: string;
}

export function configurePassport(): void {
  passport.use(
      new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },

      (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {

        const user: OAuthUser = {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          provider: profile.provider,
        };
        return done(null, user);
      }
    )
  );

  const jwtOpts: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(jwtOpts, (payload: any, done: (err: any, user?: any) => void) => {
      if (!payload || !payload.sub) {
        return done(null, false);
      }
      const user = { id: payload.sub };
      return done(null, user);
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj: any, done) => {
    done(null, obj);
  });


}

export default configurePassport;