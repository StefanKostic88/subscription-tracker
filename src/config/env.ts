import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const PORT = Number(process.env.PORT);
const NODE_ENV = process.env.NODE_ENV || "development";

export { PORT, NODE_ENV };
