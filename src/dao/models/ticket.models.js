import mongoose, { Schema, Types, model } from "mongoose";
import { randomUUID } from "crypto";

const ticketSchema = new Schema({
  id_purchase: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  code: {
    type: String,
    default: () => randomUUID(),
    unique: true,
  },
  purchase_datatime: {
    type: Date,
    default: Date.now,
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

export const ticketModel = model("Tickets", ticketSchema);
