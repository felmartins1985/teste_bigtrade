import cors from 'cors';
import express, { Express } from 'express';
import expressRoute from './routes/express-route'
import serverless from 'serverless-http';

export class App {
  public app: Express;

  constructor() {
    this.app = express();
    this.app.use(cors());
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
  }

  private routes() {
    this.app.use(`/express`, expressRoute);
  }
}

export const { app } = new App();
export const handler = serverless(app);
