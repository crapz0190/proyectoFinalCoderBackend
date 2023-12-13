/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import env from "../dotenv.js";

const configDB = async () => {
  try {
    return await mongoose.connect(env.URI);
  } catch (e) {
    console.error(e.message);
  }
};

mongoose.connection.once("open", (_) => {
  console.log(">> DB is connected <<");
});

export default configDB;
