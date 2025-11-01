import { Router } from "express";
import UserController from "../controllers/userController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import RoleMiddleware, { UserRole } from "../middlewares/roleMiddleware.ts";

class UserRoutes {
    router: Router;
    userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const authMiddleware = new Authmiddleware();
        const roleMiddleware = new RoleMiddleware();

        this.router.get(
            "/entreprises",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.userController.searchEntreprises.bind(this.userController)
        );

        this.router.get(
            "/entreprises/:id",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.userController.getEntrepriseById.bind(this.userController)
        );

        this.router.put(
            "/entreprises/:id/validate",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.userController.validateEntreprise.bind(this.userController)
        );
    }
}

export default UserRoutes;