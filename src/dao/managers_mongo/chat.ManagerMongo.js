import { messageModel } from "../models/messages.models.js";

class MessageManager {
  //Envía un nuevo mensaje al chat
  async sendMessage(message) {
    const newMessage = await messageModel.create(message);
  }

  async getMessages() {
    const listaMensajes = await messageModel.find().lean().exec();
    return listaMensajes;
  }
}

export default MessageManager;
