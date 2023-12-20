import { cartModel } from "../models/carts.models.js";
import { productModel } from "../models/products.models.js";

class CartManager {
  //Método auxiliar para obtener todos los carritos de la colección
  async getAllCarts() {
    const listCarts = await cartModel.find();
    return listCarts;
  }

  //Método para obtener un carrito específico, dado su id
  async getCartById(id) {
    const cart = await cartModel.findOne({ _id: id }).lean();
    return cart;
  }

  //Método para crear un carrito en la colección
  async createCart() {
    const cart = await cartModel.create({});
    return cart;
  }

  //Método para agregar un producto al carrito, dados sus respectivos ids
  async addProductToCart(cid, pid, quantity) {
    const cart = await cartModel.findById(cid);
    if (cart) {
      const prod = await productModel.findById(pid);

      if (prod) {
        const indice = cart.products.findIndex((item) =>
          item.id_prod.equals(pid)
        );
        if (indice != -1) {
          cart.products[indice].quantity += quantity;
          await cart.save();
          console.log(cart);
        } else {
          cart.products.push({ id_prod: pid, quantity: quantity });
          await cart.save();
        }
      }
    }

    const respuesta = await cartModel.findByIdAndUpdate(cid, cart);
    return respuesta;
  }

  //Método para actualizar el carrito según un producto
  async updateCart(cid, pid, quantity) {
    const cart = await cartModel.findById(cid);

    if (cart) {
      const prodIndex = cart.products.findIndex((prod) =>
        prod.id_prod.equals(pid)
      );
      if (prodIndex != -1) {
        cart.products[prodIndex].quantity = quantity;
      }
      await cart.save();
      return cart;
    }
  }

  //Método para eliminar un producto del carrito
  async deleteProductOfCart(cid, pid) {
    const cart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { id_prod: pid } } },
      { new: true }
    );
    return cart;
  }

  //Método para vacíar el carrito
  async emptyCart(cid) {
    const cart = await cartModel.findById(cid);
    if (cart) cart.products = [];
    await cart.save();
    return cart;
  }

  //Método para actualizar un carrito, devolviendo los documentos y la paginación correspondiente
  async updateCartPaginate(cid, updateProduct, options) {
    const newCart = await this.updateCart(
      cid,
      updateProduct.pid,
      updateProduct.quantity
    );
    if (newCart) {
      await newCart.save();

      const cart = await cartModel.paginate({ _id: cid }, options);
      const resultados = {
        status: "success",
        payload: cart.docs,
        totalPages: cart.totalPages,
        prevPage: cart.prevPage,
        nextPage: cart.nextPage,
        page: cart.page,
        hasPrevPage: cart.hasPrevPage,
        hasNextPage: cart.hasNextPage,
        prevLink: cart.hasPrevPage ? `/carts?page=${cart.prevPage}` : null,
        nextLink: cart.hasNextPage ? `/carts?page=${cart.nextPage}` : null,
      };
      return resultados;
    }
  }
}

export default CartManager;
