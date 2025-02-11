import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env";

class DataBaseConnection {
  public static instance: DataBaseConnection;
  private _db?: typeof mongoose;
  private _connectionString = DB_URI;

  public static getInstance(): DataBaseConnection {
    if (!DataBaseConnection.instance) {
      DataBaseConnection.instance = new DataBaseConnection();
    }

    return DataBaseConnection.instance;
  }

  public async startConnection(): Promise<void> {
    if (!this._connectionString) {
      throw new Error(
        "Please define the MONGODB_URI envirament variable inside .env.local"
      );
    }

    try {
      this._db = await mongoose.connect(this._connectionString);
      console.log(`Succesfully connected to MongoDB in ${NODE_ENV} mode`);
    } catch (error) {
      console.error("Error connecting to database", error);
      process.exit(1);
    }
  }

  public async closeConnection(): Promise<void> {
    try {
      await this._db?.disconnect();
      console.log("MongoDB connection closed");
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
    }
  }

  checkHealth(): void {
    console.log("Check Health");
  }
}

export default DataBaseConnection;
