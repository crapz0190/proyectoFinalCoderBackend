import dotenv from "dotenv";
import { join } from "node:path";
import dirname from "./dirname.js";

dotenv.config({
  path: join(dirname, ".env"),
});

const configEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 4000,
  URI: process.env.URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  TOKEN_SECRET_JWT: process.env.TOKEN_SECRET_JWT,
  TOKEN_SECRET_MONGO: process.env.TOKEN_SECRET_MONGO,
};

console.log(`NODE_ENV = ${configEnv.NODE_ENV}`);

export default configEnv;
