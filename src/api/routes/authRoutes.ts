import { Router } from 'express';
import AuthController from '../controllers/authController.js';

export default class AuthRoutes {
  public router: Router;
  private controller: AuthController;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/register', this.controller.register.bind(this.controller));
    this.router.post('/login', this.controller.login.bind(this.controller));
  }

  public getRouter(): Router {
    return this.router;
  }
}