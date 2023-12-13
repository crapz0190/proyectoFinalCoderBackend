import { usersModel } from "../models/users.model.js";
import BasicManager from "./basicManager.js";

class UsersManager extends BasicManager {
  constructor() {
    super(usersModel);
  }

  async findByEmail(email) {
    try {
      const response = await usersModel.findOne({ email });
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

export const usersManager = new UsersManager();
