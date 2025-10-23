import express from 'express';
import type { Application } from 'express';
import AuthRoutes from './api/routes/authRoutes.js';
import TestRoutes from './api/routes/TestRoutes.js';

export default class App {
  public app: Application;
  private authRoutes: AuthRoutes;
  private testRoutes: TestRoutes;

  constructor() {
    this.app = express();
    this.authRoutes = new AuthRoutes();
    this.testRoutes = new TestRoutes();
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    this.app.use('/api/auth', this.authRoutes.getRouter());
    this.app.use('/api/test', this.testRoutes.getRouter());
  }

  public getExpressApp(): Application {
    return this.app;
  }
}