import CartManager from "../dao/managers_mongo/cartManagerMongo.js";
import ProductManager from "../dao/managers_mongo/productManagerMongo.js";
import { ticketModel } from "../dao/models/ticket.models.js";
import { userModel } from "../dao/models/users.models.js";

const cartManager = new CartManager();
const productManager = new ProductManager();

const purchase = async (req, res) => {
  const { cid } = req.params;
  const purchaser = req.user.user.email;
  try {
    const cart = await cartManager.getCartById(cid);
    if (cart && cart.products.length > 0) {
      let amount = 0;

      for (const prod of cart.products) {
        const id = prod.id_prod;
        const prodBD = await productManager.getProductById(id);

        if (prod.quantity <= prodBD.stock) {
          if (!req.user.user.user_premium) {
            amount += prodBD.price * prod.quantity;
            console.log(`Monto total: ${amount}`);

            prodBD.stock -= prod.quantity;
            await productManager.updateProduct(
              id,
              prodBD.title,
              prodBD.description,
              prodBD.stock,
              prodBD.status,
              prodBD.code,
              prodBD.price,
              prodBD.category
            );
          } else {
            amount += prodBD.price * prod.quantity * 0.9;
            console.log(`Monto total: ${amount}`);

            prodBD.stock -= prod.quantity;
            await productManager.updateProduct(
              id,
              prodBD.title,
              prodBD.description,
              prodBD.stock,
              prodBD.status,
              prodBD.code,
              prodBD.price,
              prodBD.category
            );
          }
        }
      }

      try {
        const ticketPurchaser = await ticketModel.create({
          amount: amount,
          purchaser: purchaser,
        });
        res.json(ticketPurchaser);
        fetch("http://localhost:8080/mail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticketPurchaser),
        });
      } catch (error) {
        console.error(error);
        res.status(500).send("Ocurrió un error al procesar la solicitud");
      }
      await cartManager.emptyCart(cid);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error al procesar la solicitud");
  }
};

export default purchase;
