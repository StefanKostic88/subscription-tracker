import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const PORT = Number(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV || "development";
const DB_URI = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;
const ARCJET_ENV = process.env.ARCJET_ENV;
const ARCJET_KEY = process.env.ARCJET_KEY as string;

export {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_ENV,
  ARCJET_KEY,
};
