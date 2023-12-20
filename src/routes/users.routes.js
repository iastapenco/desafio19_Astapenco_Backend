import { Router } from "express";
import UserManager from "../dao/managers_mongo/userManagerMongo.js";

const userRouter = Router();
const userManager = new UserManager();

userRouter.get("/", async (req, res) => {
  try {
    const users = await userManager.usersList();
    res.status(200).send({ response: "Ok", mensaje: users });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userManager.findUserById(id);
    if (user) res.status(200).send({ response: "Ok", mensaje: user });
    else res.status(404).send({ response: "Error", mensaje: "User not found" });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, age, email, password } = req.body;
  try {
    const user = await userManager.updateUserById(
      id,
      first_name,
      last_name,
      age,
      email,
      password
    );
    if (user)
      res.status(200).send({ response: "Usuario actualizado", mensaje: user });
    else
      res
        .status(404)
        .send({ response: "Error", mensaje: "Usuario no encontrado" });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const respuesta = await userManager.deleteUserById(id);
    if (respuesta)
      res.status(200).send({
        response: "Ok",
        mensaje: "Usuario eliminado",
        usuarios: respuesta,
      });
    else res.status(404).send({ response: "Error", mensaje: "User not found" });
  } catch (error) {
    res.status(400).send({ response: "Error", mensaje: error });
  }
});

export default userRouter;
