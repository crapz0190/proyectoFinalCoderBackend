import { messagesManager } from "../dao/managers/messagesManager.js";

class MessageController {
  // Metodo GET para mostrar todos los mensajes
  listMessages = async (req, res) => {
    try {
      const messages = await messagesManager.findAll();
      if (!messages) {
        return res
          .status(404)
          .json({ status: "error", message: "Messages not found" });
      } else {
        return res
          .status(200)
          .json({ status: "Message list", payload: messages });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo GET para mostrar todos los mensajes
  messageById = async (req, res) => {
    const { mid } = req.params;
    try {
      const messages = await messagesManager.getById(mid);
      if (!messages) {
        return res
          .status(404)
          .json({ status: "error", message: "Messages not found" });
      } else {
        return res
          .status(200)
          .json({ status: "Message found", payload: messages });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo POST para crear mensages
  createMessages = async (req, res) => {
    const obj = req.body;
    const { email, description } = obj;

    if (!email || !description) {
      return res
        .status(400)
        .json({ status: "error", message: "All field are required" });
    }

    try {
      const messageCreated = await messagesManager.createOne(obj);
      if (!messageCreated) {
        return res
          .status(500)
          .json({ status: "error", message: "Mensage could not be created" });
      } else {
        return res
          .status(200)
          .json({ status: "Created", payload: messageCreated });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo PUT para actualizar mensages
  updateMessages = async (req, res) => {
    const { mid } = req.params;
    const obj = req.body;
    const { email, description } = obj;

    if (!email || !description) {
      return res
        .status(400)
        .json({ status: "error", message: "All field are required" });
    }

    try {
      const messageUpdated = await messagesManager.updateOne(mid, obj);
      if (!messageUpdated) {
        return res
          .status(500)
          .json({ status: "error", message: "Mensage could not be updated" });
      } else {
        return res
          .status(200)
          .json({ status: "Updated", payload: messageUpdated });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo DELETE para eliminar mensages
  deleteMessages = async (req, res) => {
    const { mid } = req.params;

    try {
      const messageRemoved = await messagesManager.deleteOne(mid);
      if (!messageRemoved) {
        return res
          .status(500)
          .json({ status: "error", message: "Mensage could not be removed" });
      } else {
        return res
          .status(200)
          .json({ status: "Deleted", payload: messageRemoved });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };
}

export const messageController = new MessageController();
