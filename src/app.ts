import express, { Express, Router } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";
import { PORT, NODE_ENV } from "./config/env";
import { userRouter, authRouter, subscriptionRouter } from "./routes";
import DataBaseConnection from "./database/mongodb";

abstract class CoreApp {
  protected _app: Express;
  protected _db: DataBaseConnection;
  protected _server?: Server<typeof IncomingMessage, typeof ServerResponse>;
  protected _port: number = PORT;

  protected constructor() {
    this._app = express();
    this._db = DataBaseConnection.getInstance();
    this.init();
  }

  protected init(): void {}

  public startServer(): void {}

  public getApp(): Express {
    return this._app;
  }
}

export class App extends CoreApp {
  public static instance: App;

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }

    return App.instance;
  }

  protected init(): void {
    const router = Router();
    this._app.use("/api/v1", router);

    // middleware spot

    router.use("/auth", authRouter);
    router.use("/users", userRouter);
    router.use("/subscriptions", subscriptionRouter);
  }
  public startServer(): void {
    this._server = this._app.listen(this._port, async () => {
      console.log(`Server running on port: ${this._port}, env: ${NODE_ENV}`);
      await this._db.startConnection();
    });
  }
}

export const app = App.getInstance();
