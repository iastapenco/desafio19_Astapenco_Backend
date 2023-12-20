import { Router } from "express";
import CartManager from "../dao/managers_mongo/cartManagerMongo.js";
import { passportError, authorization } from "../utils/messagesError.js";
import purchase from "../utils/purchaseController.js";

const cartRouter = Router();
const cartManager = new CartManager();

//Obtener todos los carritos de la colección
cartRouter.get("/", async (req, res) => {
  try {
    const listCarts = await cartManager.getAllCarts();
    res.status(200).send({ respuesta: "OK", mensaje: listCarts });
  } catch (error) {
    res.status(500).send({ respuesta: "Error", mensaje: error });
  }
});

//Obtener un carrito específico, dado su id
cartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await cartManager.getCartById(id);
    if (cart) res.render("cart", { cart });
    else
      res.status(404).send({
        respuesta: "Error en consultar Carrito",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consulta carrito", mensaje: error });
  }
});

//Crear un carrito en la colección
cartRouter.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(200).send({ respuesta: "OK", mensaje: cart });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear Carrito", mensaje: error });
  }
});

//Agregar un producto al carrito, dados sus respectivos ids
cartRouter.post(
  "/:cid/products/:pid",
  passportError("jwt"),
  authorization("user"),
  async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
      const respuesta = await cartManager.addProductToCart(cid, pid, quantity);
      if (respuesta) {
        res.status(200).send({ respuesta: "OK", mensaje: respuesta });
      } else {
        res.status(404).send({
          respuesta: "Error en agregar producto Carrito",
          mensaje: "Cart Not Found",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({
        respuesta: "Error en agregar producto Carrito",
        mensaje: error,
      });
    }
  }
);

//Actualizar el carrito según un producto
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartManager.updateCart(cid, pid, quantity);
    if (!cart) {
      return res.status(404).send({ message: "No se encontró el carrito" });
    }
    res.status(200).send({ message: "Carrito actualizado", respuesta: cart });
  } catch (error) {
    res.status(500).send({ message: "Hubo un error al procesar tu solicitud" });
    console.log(error);
  }
});

//Eliminar un producto del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await cartManager.deleteProductOfCart(cid, pid);
    if (!cart) {
      return res.status(404).send({ message: "No se encontró el carrito" });
    }
    res.status(200).send({ message: "Producto eliminado", respuesta: cart });
  } catch (error) {
    res.status(500).send({
      message: "Hubo un error al procesar tu solicitud",
      error: error,
    });
  }
});

//Vacíar el carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartManager.emptyCart(cid);
    if (!cart) {
      return res.status(404).send({ message: "No se encontró el carrito" });
    }
    res.status(200).send({ message: "El carrito está vacío", respuesta: cart });
  } catch (error) {
    res.status(500).send({
      message: "Hubo un error al procesar tu solicitud",
      error: error,
    });
  }
});

//Actualizar un carrito, devolviendo los documentos y la paginación correspondiente
cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { id_prod, quantity } = req.body;
  const updateProduct = { pid: id_prod, quantity: quantity };
  try {
    const options = {
      page: 1,
      limit: 10,
    };

    const resultados = await cartManager.updateCartPaginate(
      cid,
      updateProduct,
      options
    );

    if (!resultados) {
      return res
        .status(404)
        .send({ message: "error", respuesta: "Carrito no encontrado" });
    }
    res
      .status(200)
      .send({ message: "Carrito actualizado", respuesta: resultados });
  } catch (error) {
    res.status(500).send({ message: "error", respuesta: error });
  }
});

cartRouter.post(
  "/:cid/purchase",
  passportError("jwt"),
  authorization("user"),
  purchase
);

export default cartRouter;
