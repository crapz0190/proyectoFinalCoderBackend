import { ticketsModel } from "../models/ticket.model.js";
import BasicManager from "./basicManager.js";

class TicketsManager extends BasicManager {
  constructor() {
    super(ticketsModel);
  }
}

export const ticketsManager = new TicketsManager();
