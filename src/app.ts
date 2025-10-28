import express from 'express';
import type { Application, Request, Response } from 'express';
import Authroutes from './api/routes/authRoutes.ts';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.ts';
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
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());

    this.app.use(
      session({
        secret: process.env.SECRET_KEY || '',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    configurePassport();

  }

  private setupRoutes(): void {
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'OK', message: 'Server is running' });
    });
    this.app.use(("/api/auth"), this.authroutes.router);
    this.app.use("/api/test", this.testRoutes.router);
  }

  public getExpressApp(): Application {
    return this.app;
  }
}