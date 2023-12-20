import { userModel } from "../models/users.models.js";

class UserManager {
  //Método para buscar todos los usuarios
  async usersList() {
    const users = await userModel.find();
    return users;
  }

  //Método para buscar un usuario por su id
  async findUserById(id) {
    const user = await userModel.findById(id);
    return user;
  }

  //Método para crear un usuario
  async createUser(first_name, last_name, age, email, password) {
    const newUser = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password,
    });
    return newUser;
  }

  //Método para actualizar usuario
  async updateUserById(id, first_name, last_name, age, email, password) {
    const user = await userModel.findByIdAndUpdate(id, {
      first_name,
      last_name,
      age,
      email,
      password,
    });
    return user;
  }

  //Método para eliminar un usuario
  async deleteUserById(id) {
    const deleteUser = await userModel.findByIdAndDelete(id);
    if (deleteUser) {
      const respuesta = await this.usersList();
      return respuesta;
    }
  }
}

export default UserManager;
