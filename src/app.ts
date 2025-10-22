import express from 'express';
import type { Application, Request, Response } from 'express';

export default class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', message: 'Server is running' });
    });

  }


  public getExpressApp(): Application {
    return this.app;
  }
}