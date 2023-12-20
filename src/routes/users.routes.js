import { Router } from "express";
import crypto from "crypto";
import { sendRecoveryMail } from "../config/nodemailer.js";
import UserManager from "../dao/managers_mongo/userManagerMongo.js";

const userRouter = Router();
const recoveryLinks = {};
const userManager = new UserManager();

userRouter.post("/password-recovery", (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(20).toString("hex");

    recoveryLinks[token] = {
      email: email,
      timestamp: Date.now(),
    };

    const recoveryLink = `http://localhost:8080/api/users/reset-password/${token}`;

    sendRecoveryMail(email, recoveryLink);

    res.status(200).send("Correo de recuperación enviado");
  } catch (error) {
    res.status(500).send(`Error al enviar el mail ${error}`);
  }
});

userRouter.post("/reset-password/:token", (req, res) => {
  const { token } = req.params;
  const { newPassword, newPassword2 } = req.body;

  try {
    const linkData = recoveryLinks[token];
    if (linkData && Date.now() - linkData.timestamp <= 3600000) {
      const { email } = linkData;

      if (newPassword == newPassword2) {
        delete recoveryLinks[token];

        res.status(200).send("Contraseña modificada correctamente");
      } else {
        res.status(400).send("Las contraseñas deben ser idénticas");
      }
    } else {
      res.status(400).send("Token inválido o expirado");
    }
  } catch (error) {
    res.status(500).send(`Error al modificar contraseña ${error}`);
  }
});

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
