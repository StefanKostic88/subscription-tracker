import express, { Express } from "express";
import { Server, IncomingMessage, ServerResponse } from "http";

abstract class CoreApp {
  protected _app: Express;
  protected _server?: Server<typeof IncomingMessage, typeof ServerResponse>;
  protected _port: number = Number(process.env) || 8000;

  protected constructor() {
    this._app = express();
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

  protected init(): void {}
  public startServer(): void {
    this._server = this._app.listen(this._port, () => {
      console.log(`Server running on port: ${this._port}`);
    });
  }
}

export const app = App.getInstance();
