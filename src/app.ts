import express from 'express';
import type { Application, Request, Response } from 'express';
import Authroutes from './api/routes/authRoutes.ts';
import PropertyRoutes from './api/routes/propertyRoutes.ts';
import UserRoutes from './api/routes/userRoutes.ts';
import ReportRoutes from './api/routes/reportRoutes.ts';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import configurePassport from './config/passport.ts';
import Mediacontroller from './api/controllers/mediaController.ts';

export default class App {

  public app: Application;
  public authroutes: Authroutes;
  public propertyRoutes: PropertyRoutes;
  public userRoutes: UserRoutes;
  public reportRoutes: ReportRoutes;

  constructor() {
    this.app = express();
    this.authroutes = new Authroutes();
    this.propertyRoutes = new PropertyRoutes();
    this.userRoutes = new UserRoutes();
    this.reportRoutes = new ReportRoutes();

    this.app.use(express.json());
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());

    this.app.use(
      session({
        secret: process.env.JWT_SECRET || '',
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
    this.app.use(("/api/properties"), this.propertyRoutes.router);
    this.app.use(("/api/users"), this.userRoutes.router);
    this.app.use(("/api/reports"), this.reportRoutes.router);
  }

  public getExpressApp(): Application {
    return this.app;
  }
}