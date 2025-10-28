import express from 'express';
import type { Application, Request, Response } from 'express';
import Authroutes from './api/routes/authRoutes.ts';
import TestRoutes from './api/routes/exampleRouter.ts';

export default class App {

  public app: Application;
  public authroutes: Authroutes;
  public testRoutes: TestRoutes;

  constructor() {
    this.app = express();
    this.authroutes = new Authroutes();
    this.testRoutes = new TestRoutes();
    this.app.use(express.json());
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', message: 'Server is running' });
    });
    
    this.app.use("/api/auth", this.authroutes.router);
    this.app.use("/api/test", this.testRoutes.router);
  }

  public getExpressApp(): Application {
    return this.app;
  }
}