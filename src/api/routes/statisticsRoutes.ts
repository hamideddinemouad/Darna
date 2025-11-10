import { Router } from "express";
import StatisticsController from "../controllers/statisticsController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import RoleMiddleware, { UserRole } from "../middlewares/roleMiddleware.ts";

class StatisticsRoutes {
    router: Router;
    statisticsController: StatisticsController;

    constructor() {
        this.router = Router();
        this.statisticsController = new StatisticsController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const authMiddleware = new Authmiddleware();
        const roleMiddleware = new RoleMiddleware();

        this.router.get(
            "/basic",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.statisticsController.getBasicStats.bind(this.statisticsController)
        );

        this.router.get(
            "/advanced",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.statisticsController.getAdvancedStats.bind(this.statisticsController)
        );
    }
}

export default StatisticsRoutes;