import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const PORT = Number(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV || "development";
const DB_URI = process.env.DB_URI;

export { PORT, NODE_ENV, DB_URI };
