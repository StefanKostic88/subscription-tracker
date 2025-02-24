import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const PORT = Number(process.env.PORT);
const SERVER_URL = process.env.SERVER_URL as string;
const NODE_ENV = process.env.NODE_ENV || "development";
const DB_URI = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;
const ARCJET_ENV = process.env.ARCJET_ENV;
const ARCJET_KEY = process.env.ARCJET_KEY as string;
const QSTASH_URL = process.env.QSTASH_URL as string;
const QSTASH_TOKEN = process.env.QSTASH_TOKEN as string;
const QSTASH_CURRENT_SIGNING_KEY = process.env
  .QSTASH_CURRENT_SIGNING_KEY as string;
const QSTASH_NEXT_SIGNING_KEY = process.env.QSTASH_NEXT_SIGNING_KEY as string;

export {
  PORT,
  SERVER_URL,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_ENV,
  ARCJET_KEY,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
};
