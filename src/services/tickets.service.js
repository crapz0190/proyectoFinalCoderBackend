import { ticketsManager } from "../dao/managers/ticketsManager.js";

class TicketService {
  createTicket = async (obj) => {
    const tickets = await ticketsManager.createOne(obj);
    return tickets;
  };
}
export const ticketService = new TicketService();
