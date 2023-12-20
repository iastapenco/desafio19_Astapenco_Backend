import { userModel } from "../models/users.models.js";

class SessionManager {
  async findUser(email) {
    const user = await userModel.findOne({ email: email });
    return user;
  }

  async validUser(email, password) {
    const user = await this.findUser(email);

    if (user) {
      if (user.password == password) return true;
    }
  }
}

export default SessionManager;
