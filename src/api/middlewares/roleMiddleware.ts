import type { NextFunction, Request, Response } from "express";

export enum UserRole {
    PARTICULIER = "Particulier",
    ENTREPRISE = "Entreprise",
    ADMIN = "Admin"
}

class RoleMiddleware {
    
    public hasRole(...allowedRoles: UserRole[]) {
        return (req: Request, res: Response, next: NextFunction): void => {
            if (!res.locals.payload) {
                res.status(401).json({ 
                    error: "Unauthorized", 
                    message: "You must be logged in to access this resource" 
                });
                return;
            }

            const userRole = res.locals.payload.role;

            if (!userRole) {
                res.status(403).json({ 
                    error: "Forbidden", 
                    message: "No role assigned to this user" 
                });
                return;
            }

            if (!allowedRoles.includes(userRole)) {
                res.status(403).json({ 
                    error: "Forbidden", 
                    message: `Access denied. Required role(s): ${allowedRoles.join(", ")}. Your role: ${userRole}` 
                });
                return;
            }

            next();
        };
    }

    public isParticulier(req: Request, res: Response, next: NextFunction): void {
        this.hasRole(UserRole.PARTICULIER)(req, res, next);
    }

    public isEntreprise(req: Request, res: Response, next: NextFunction): void {
        this.hasRole(UserRole.ENTREPRISE)(req, res, next);
    }

    public isAdmin(req: Request, res: Response, next: NextFunction): void {
        this.hasRole(UserRole.ADMIN)(req, res, next);
    }

    public isParticulierOrEntreprise(req: Request, res: Response, next: NextFunction): void {
        this.hasRole(UserRole.PARTICULIER, UserRole.ENTREPRISE)(req, res, next);
    }

    public isAnyRole(req: Request, res: Response, next: NextFunction): void {
        this.hasRole(UserRole.PARTICULIER, UserRole.ENTREPRISE, UserRole.ADMIN)(req, res, next);
    }
}

export default RoleMiddleware;