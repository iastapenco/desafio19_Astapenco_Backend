import "dotenv/config";
import express from "express";
import multer from "multer";
import productRouter from "./routes/products.routes.js";
import viewRouter from "./routes/view.routes.js";
import cartRouter from "./routes/carts.routes.js";
import userRouter from "./routes/users.routes.js";
import sessionRouter from "./routes/session.routes.js";
import loggerRouter from "./routes/logger.routes.js";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import { Server } from "socket.io";
import path from "path";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";
import initalizePassport from "./config/passport.js";
import ProductManager from "./dao/managers_mongo/productManagerMongo.js";
import MessageManager from "./dao/managers_mongo/chat.ManagerMongo.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import nodemailer from "nodemailer";
import { addLogger } from "./config/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const PORT = 8080;
const app = express();
app.use(addLogger);
const messageManager = new MessageManager();
const productManager = new ProductManager();
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "profematetoledo2@gmail.com",
    pass: process.env.PASSWORD_EMAIL,
    authMethod: "LOGIN",
  },
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("BDD conectada");
  })
  .catch(() => console.log("Error en conexion a BDD"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Documentacion del curso de Backend",
      description: "API Coffee Shop",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

const specs = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SIGNED_COOKIES));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 300,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
initalizePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));
const upload = multer({ storage: storage });
app.use("/static", express.static(path.join(__dirname, "/public")));
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`Servidor Socket.io del cliente conectado con id: ${socket.id}`);

  socket.on("mensaje", async (infoMensaje) => {
    await messageManager.sendMessage(infoMensaje);
    const listaMensajes = await messageManager.getMessages();
    socket.emit("mensajes", listaMensajes);
  });

  socket.on("nuevoProducto", async (data) => {
    const updatedProduct = await productManager.addProduct(
      data.title,
      data.description,
      data.stock,
      data.code,
      data.price,
      data.category
    );
    socket.emit("productoUpdated", updatedProduct);
    console.log(updatedProduct);
  });
});

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/loggerTest", loggerRouter);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.post("/mail", async (req, res) => {
  try {
    const { purchaser, amount, code, purchase_datatime } = req.body;
    await transporter.sendMail({
      from: "TEST MAIL profematetoledo2@gmail.com",
      to: `${purchaser}`,
      subject: "Confirmación de Compra",
      html: `
        <div>
        <h1>Buenas tardes, le confirmamos su compra</h1>
        <h2>Monto total: ${amount}</h2>
        <h2>Código de su compra: ${code}</h2>
        <h2>Fecha y hora: ${purchase_datatime}</h2>
        </div>
      `,
    });
    res.send("Email enviado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocurrió un error al enviar el email");
  }
});

app.post("/upload", upload.single("product"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.status(200).send("Imagen cargada");
});
