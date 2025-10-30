import express from 'express';
import type { Application, Request, Response } from 'express';
import Authroutes from './api/routes/authRoutes.ts';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.ts';
import Mediacontroller from './api/controllers/mediaController.ts';

export default class App {

  public app: Application;
  public authroutes: Authroutes;


  constructor() {
    this.app = express();
    this.authroutes = new Authroutes();

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
    this.app.get("/api/annonce", async (req : Request, res : Response) => {
      const mediaController = new Mediacontroller();
      res.json(await mediaController.fetchImages(["2025-10-27T22:02:21.998Z", "2025-10-27T22:02:22.036Z"]))
    })
    this.app.use(("/api/auth"), this.authroutes.router);
  }

  public getExpressApp(): Application {
    return this.app;
  }
}