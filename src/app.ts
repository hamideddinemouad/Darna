import express from 'express';
import type { Application, Request, Response } from 'express';
import Authroutes from './api/routes/authRoutes.ts';

export default class App {

  public app: Application;
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

  public getExpressApp(): Application {
    return this.app;
  }
}