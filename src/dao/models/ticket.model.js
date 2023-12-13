import { Schema, model } from "mongoose";

const ticketCollection = "Tickets";

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    default: generateUniqueCode,
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

function generateUniqueCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export const ticketsModel = model(ticketCollection, ticketSchema);
