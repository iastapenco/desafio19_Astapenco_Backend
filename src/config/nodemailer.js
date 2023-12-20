import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "profematetoledo2@gmail.com",
    pass: process.env.PASSWORD_EMAIL,
    authMethod: "Login",
  },
});

export const sendRecoveryMail = (email, recoveryLink) => {
  const mailOptions = {
    from: "profematetoledo2@gmail.com",
    to: email,
    subject: "Link de recuperación de contraseña",
    text: `Haga click en el siguiente enlace para recuperar su contraseña: ${recoveryLink}`,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log("Email enviado correctamente");
  });
};
