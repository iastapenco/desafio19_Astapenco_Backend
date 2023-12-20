import { Router } from "express";
import ProductManager from "../dao/managers_mongo/productManagerMongo.js";
import { passportError, authorization } from "../utils/messagesError.js";

const productRouter = Router();
const productManager = new ProductManager();

//Obtener todos los productos
productRouter.get("/", async (req, res) => {
  try {
    const { limit, page, sort, category } = req.query;

    const options = {
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort: {
        price: Number(sort),
      },
    };

    if (!(options.sort.price === -1 || options.sort.price === 1)) {
      delete options.sort;
    }

    const prods = await productManager.getProducts(
      {
        // category: String(category),
      },
      options
    );
    res.status(200).send({ respuesta: "OK", mensaje: prods });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar productos", mensaje: error });
  }
});

//Obtener un producto específico por su id
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productManager.getProductById(id);
    if (prod) res.status(200).send({ respuesta: "OK", mensaje: prod });
    else
      res.status(404).send({
        respuesta: "Error en consultar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en la consulta del producto", mensaje: error });
  }
});

//Crear un producto
productRouter.post(
  "/",
  passportError("jwt"),
  authorization("admin"),
  async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;
    try {
      const prod = await productManager.addProduct(
        title,
        description,
        stock,
        code,
        price,
        category
      );
      res.status(200).send({ respuesta: "OK", mensaje: prod });
    } catch (error) {
      res
        .status(400)
        .send({ respuesta: "Error en crear productos", mensaje: error });
    }
  }
);

//Actualizar un producto dado su id
productRouter.put(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, stock, status, code, price, category } =
      req.body;

    try {
      const prod = await productManager.updateProduct(
        id,
        title,
        description,
        stock,
        status,
        code,
        price,
        category
      );
      if (prod)
        res
          .status(200)
          .send({ respuesta: "OK", mensaje: "Producto actualizado" });
      else
        res.status(404).send({
          respuesta: "Error en actualizar Producto",
          mensaje: "Not Found",
        });
    } catch (error) {
      res
        .status(400)
        .send({ respuesta: "Error en actualizar producto", mensaje: error });
    }
  }
);

//Borrar un producto de la colección, dado su id
productRouter.delete(
  "/:id",
  passportError("jwt"),
  authorization("admin"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const prod = await productManager.deleteProduct(id);
      if (prod)
        res
          .status(200)
          .send({ respuesta: "OK", mensaje: "Producto eliminado" });
      else
        res.status(404).send({
          respuesta: "Error en eliminar Producto",
          mensaje: "Not Found",
        });
    } catch (error) {
      res
        .status(400)
        .send({ respuesta: "Error en eliminar producto", mensaje: error });
    }
  }
);

export default productRouter;
