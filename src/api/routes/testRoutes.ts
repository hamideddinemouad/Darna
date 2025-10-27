import { Router, Request, Response } from 'express';
import AuthMiddleware from '../middlewares/authMiddleware.js';

export default class TestRoutes {
  public router: Router;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/admin',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.authorize('Admin'),
      this.adminRoute
    );

    this.router.get('/business',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.authorize('Entreprise', 'Admin'),
      this.businessRoute
    );

    this.router.get('/user',
      this.authMiddleware.authenticate.bind(this.authMiddleware),
      this.authMiddleware.authorize('Particulier', 'Entreprise', 'Admin'),
      this.userRoute
    );
  }

  private adminRoute(req: Request, res: Response): void {
    res.json({ message: 'Admin access granted' });
  }

  private businessRoute(req: Request, res: Response): void {
    res.json({ message: 'Business access granted' });
  }

  private userRoute(req: Request, res: Response): void {
    res.json({ message: 'User access granted' });
  }

  public getRouter(): Router {
    return this.router;
  }
}