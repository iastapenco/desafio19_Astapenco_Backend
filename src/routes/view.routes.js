import { Router } from "express";
import ProductManager from "../dao/managers_mongo/productManagerMongo.js";
import MessageManager from "../dao/managers_mongo/chat.ManagerMongo.js";
import { messageModel } from "../dao/models/messages.models.js";
const viewRouter = Router();
const productManager = new ProductManager();
const messageManager = new MessageManager();

//Muestra la lista de productos
viewRouter.get("/", async (req, res) => {
  const listaproductos = await productManager.getProducts({}, { lean: true });
  res.render("home", { listaproductos });
});

//mustra la lista de productos y realiza una paginación
viewRouter.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, category } = req.query;

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: {
        price: Number(sort),
      },
      lean: true,
    };

    if (!(options.sort.price === -1 || options.sort.price === 1)) {
      delete options.sort;
    }

    const listaproductos = await productManager.getProducts(
      {
        /*category: String(category)*/
      },
      options
    );

    res.render("products", {
      js: "products.js",
      listaproductos,
    });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar productos", mensaje: error });
  }
});

//Muestra una lista de productos y permite agregar un producto a la colección a través de un formulario
viewRouter.get("/realtimeproducts", async (req, res) => {
  const listaproductos = await productManager.getProducts({}, { lean: true });

  res.render("realTimeProducts", {
    css: "style.css",
    js: "realTimeProducts.js",
    listaproductos,
  });
});

//Envía un nuevo mensaje al chat
viewRouter.post("/chat", async (req, res) => {
  try {
    await messageManager.sendMessage(message);
  } catch (error) {
    res
      .status(400)
      .send({ response: "Error al enviar mensaje", mensaje: error });
  }
});

//Obtiene los mensajes del chat
viewRouter.get("/chat", async (req, res) => {
  try {
    const listaMensajes = await messageManager.getMessages();
    res.render("chat", {
      css: "style.css",
      js: "chat.js",
      listaMensajes,
    });
  } catch (error) {
    res
      .status(400)
      .send({ response: "Error al cargar los mensajes", mensaje: error });
  }
});

export default viewRouter;
