import jwt from "jsonwebtoken";
import { confEnv } from "../config.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, confEnv.TOKEN_SECRET_JWT, {
    expiresIn: "1h",
  });
};
