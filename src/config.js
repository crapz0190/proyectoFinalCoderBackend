import dotenv from "dotenv";
import { join } from "node:path";
import dirname from "./utils.js";
import mongoose from "mongoose";

dotenv.config({
  path: join(dirname, ".env"),
});

export const confEnv = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT || 4000,
  URI: process.env.URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
  TOKEN_SECRET_JWT: process.env.TOKEN_SECRET_JWT,
  TOKEN_SECRET_MONGO: process.env.TOKEN_SECRET_MONGO,
};

console.log(`NODE_ENV = ${confEnv.NODE_ENV}`);

export const database = async () => {
  try {
    return await mongoose.connect(confEnv.URI);
  } catch (e) {
    console.error(e.message);
  }
};

mongoose.connection.once("open", (_) => {
  console.log(">> DB is connected <<");
});
