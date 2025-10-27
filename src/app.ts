import express from 'express';
<<<<<<< HEAD
import type { Application, Request, Response } from 'express';
import Authroutes from './api/routes/authRoutes.ts';
=======
import type { Application } from 'express';
import AuthRoutes from './api/routes/authRoutes.js';
import TestRoutes from './api/routes/TestRoutes.js';
>>>>>>> 8eeb06846401c227e5001c3d029fc3342c29f2a5

export default class App {

  public app: Application;
<<<<<<< HEAD
  public authroutes : Authroutes;

  constructor() {
    this.app = express();
    this.authroutes = new Authroutes();
    this.app.use(express.json());
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', message: 'Server is running' });
    });
    // this.app.post('/api/auth', (req: Request, res: Response) => {
    //   res.status(200).json({ status: 'OK', message: 'you are in auth' });
    // });
    this.app.use(("/api/auth"), this.authroutes.router);
  }

=======
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

>>>>>>> 8eeb06846401c227e5001c3d029fc3342c29f2a5
  public getExpressApp(): Application {
    return this.app;
  }
}