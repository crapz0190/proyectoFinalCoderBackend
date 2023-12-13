import { messagesModel } from "../models/messages.model.js";
import BasicManager from "./basicManager.js";

class MessagesManager extends BasicManager {
  constructor() {
    super(messagesModel);
  }

  async findAll() {
    try {
      const response = await messagesModel.find().lean();
      return response;
    } catch (e) {
      console.error(e);
    }
  }
}

export const messagesManager = new MessagesManager();
