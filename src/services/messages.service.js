import { messagesManager } from "../dao/managers/messagesManager.js";

class MessageService {
  findAll = async () => {
    const messages = await messagesManager.findAll();
    return messages;
  };

  findById = async (mid) => {
    const messages = await messagesManager.getById(mid);
    return messages;
  };

  createOne = async (obj) => {
    const messages = await messagesManager.createOne(obj);
    return messages;
  };

  updateOne = async (mid, obj) => {
    const messages = await messagesManager.updateOne(mid, obj);
    return messages;
  };

  deleteOne = async (mid) => {
    const messages = await messagesManager.deleteOne(mid);
    return messages;
  };
}
export const messageService = new MessageService();
