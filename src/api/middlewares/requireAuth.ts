import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import DarnaUserProfile from "../../models/darnaUserProfile.ts";

declare global {
  namespace Express {
    interface Request {
      profile?: any; 
    }
  }
}

export async function requireAuth(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant ou format invalide' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET non configuré dans .env');
    }
    
    const payload = jwt.verify(token!, JWT_SECRET!) as unknown as  {
        userId: string;
        email: string;
        role: string;
        provider: string;
        iat: number;
        exp: number;
    };
    
    const globalUserId = payload.userId;
    const email = payload.email;
    
    let darnaProfile = await DarnaUserProfile.findOne({ globalUserId });
    
      if (!darnaProfile) {

        darnaProfile = await DarnaUserProfile.create({
        globalUserId,
        email,
        abonnement: 'gratuit',
        annoncesCreees: 0,
        annoncesActives: 0,
        kycEntrepriseValide: false
      });
      
      console.log(`Nouveau profil Darna créé pour globalUserId: ${globalUserId}`);
    }
    
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      provider: payload.provider
    };
    
    req.profile = darnaProfile;
    
    next();
    
  } catch (error) {

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: 'Token expiré' });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ error: 'Token invalide' });
      return;
    }
    
    console.error('Erreur requireAuth:', error);
    res.status(401).json({ error: 'Authentification échouée' });
  }
}