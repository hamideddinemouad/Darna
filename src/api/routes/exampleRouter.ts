import { Router } from "express";
import type { Request, Response } from "express";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import RoleMiddleware, { UserRole } from "../middlewares/roleMiddleware.ts";

class TestRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const authMiddleware = new Authmiddleware();
        const roleMiddleware = new RoleMiddleware();

        // Test 1: Public route (no auth)
        this.router.get("/public", (req: Request, res: Response) => {
            res.json({ message: "Public route - everyone can access" });
        });

        // Test 2: Authenticated route (all roles)
        this.router.get(
            "/authenticated",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            (req: Request, res: Response) => {
                const { email, role } = res.locals.payload;
                res.json({ 
                    message: "Authenticated route - all roles can access",
                    user: { email, role }
                });
            }
        );

        // Test 3: Particulier only
        this.router.get(
            "/particulier",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.PARTICULIER),
            (req: Request, res: Response) => {
                const { email, role } = res.locals.payload;
                res.json({ 
                    message: "Particulier route - only Particulier can access",
                    user: { email, role }
                });
            }
        );

        // Test 4: Admin only
        this.router.get(
            "/admin",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            (req: Request, res: Response) => {
                const { email, role } = res.locals.payload;
                res.json({ 
                    message: "Admin route - only Admin can access",
                    user: { email, role }
                });
            }
        );

        // Test 5: Entreprise only
        this.router.get(
            "/entreprise",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ENTREPRISE),
            (req: Request, res: Response) => {
                const { email, role } = res.locals.payload;
                res.json({ 
                    message: "Entreprise route - only Entreprise can access",
                    user: { email, role }
                });
            }
        );

        // Test 6: Particulier OR Admin
        this.router.get(
            "/mixed",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.PARTICULIER, UserRole.ADMIN),
            (req: Request, res: Response) => {
                const { email, role } = res.locals.payload;
                res.json({ 
                    message: "Mixed route - Particulier OR Admin can access",
                    user: { email, role }
                });
            }
        );
    }
}

export default TestRoutes;