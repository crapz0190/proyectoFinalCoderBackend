import jwt from "jsonwebtoken";
import env from "../utils/dotenv.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, env.TOKEN_SECRET_JWT, {
    expiresIn: "1h",
  });
};
