import { Router } from "express";
import PropertyController from "../controllers/propertyController.ts";

class PropertyRoutes {
    router: Router;
    propertyController: PropertyController;

    constructor() {
        this.router = Router();
        this.propertyController = new PropertyController();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get("/", this.propertyController.getAllProperties.bind(this.propertyController));
        this.router.get("/:id", this.propertyController.getPropertyById.bind(this.propertyController));
    }
}

export default PropertyRoutes;