import { Router } from "express";
import ReportController from "../controllers/reportController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import RoleMiddleware, { UserRole } from "../middlewares/roleMiddleware.ts";

class ReportRoutes {
    router: Router;
    reportController: ReportController;

    constructor() {
        this.router = Router();
        this.reportController = new ReportController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const authMiddleware = new Authmiddleware();
        const roleMiddleware = new RoleMiddleware();

        this.router.get(
            "/",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.reportController.getAllReports.bind(this.reportController)
        );

        this.router.get(
            "/:id",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            roleMiddleware.hasRole(UserRole.ADMIN),
            this.reportController.getReportById.bind(this.reportController)
        );
    }
}

export default ReportRoutes;