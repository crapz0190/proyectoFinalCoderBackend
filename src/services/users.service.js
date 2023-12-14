import { usersManager } from "../dao/managers/usersManager.js";

class UserService {
  createOne = async (obj) => {
    const users = await usersManager.createOne(obj);
    return users;
  };

  findByEmail = async (email) => {
    const users = await usersManager.findByEmail(email);
    return users;
  };

  findById = async (uid) => {
    const users = await usersManager.getById(uid);
    return users;
  };
}
export const userService = new UserService();
