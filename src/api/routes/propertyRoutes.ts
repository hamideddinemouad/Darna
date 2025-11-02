import { Router } from "express";
import PropertyController from "../controllers/propertyController.ts";
import Authmiddleware from "../middlewares/authMiddleware.ts";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

class PropertyRoutes {
    router: Router;
    propertyController: PropertyController;

    constructor() {
        this.router = Router();
        this.propertyController = new PropertyController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        const authMiddleware = new Authmiddleware();

        this.router.get("/", this.propertyController.getAllProperties.bind(this.propertyController));
        
        this.router.get(
            "/my/properties",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            this.propertyController.getMyProperties.bind(this.propertyController)
        );

        this.router.get("/:id", this.propertyController.getPropertyById.bind(this.propertyController));

        this.router.post(
            "/",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            upload.fields([
                { name: 'images', maxCount: 10 },
                { name: 'videos', maxCount: 5 }
            ]),
            this.propertyController.createProperty.bind(this.propertyController)
        );

        this.router.post(
            "/:id/report",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            this.propertyController.reportProperty.bind(this.propertyController)
        );

        this.router.put(
            "/:id",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            upload.fields([
                { name: 'images', maxCount: 10 },
                { name: 'videos', maxCount: 5 }
            ]),
            this.propertyController.updateOwnProperty.bind(this.propertyController)
        );

        this.router.delete(
            "/:id",
            authMiddleware.isLoggedIn.bind(authMiddleware),
            this.propertyController.deleteOwnProperty.bind(this.propertyController)
        );
    }
}

export default PropertyRoutes;