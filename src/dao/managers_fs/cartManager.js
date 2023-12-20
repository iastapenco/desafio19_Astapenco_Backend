import { promises as fs } from "fs";

class CartManager {
  constructor() {
    this.path = "src/database/carts.json";
  }

  async getCarts() {
    const arrayCartslist = await fs.readFile(this.path, "utf-8");
    const cartsList = JSON.parse(arrayCartslist);
    return cartsList;
  }

  async getCartById(id) {
    const cartsList = await this.getCarts();
    const cartById = cartsList.find((c) => c.id === id);
    if (cartById) {
      return cartById.products;
    } else {
      return "Carrito no encontrado";
    }
  }

  async autoId() {
    const cartList = await this.getCarts();
    const counter = cartList.length;
    if (counter === 0) {
      return 1;
    } else {
      return cartList[counter - 1].id + 1;
    }
  }

  async addCart() {
    const cartList = await this.getCarts();
    const id = await this.autoId();

    const newCart = {
      id,
      products: [],
    };
    cartList.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(cartList));
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const cartsList = await this.getCarts();
    const cart = cartsList.find((c) => c.id === cid);
    if (cart) {
      const prodIndex = cart.products.findIndex((prod) => prod.pid === pid);

      if (prodIndex !== -1) {
        cart.products[prodIndex].quantity++;
      } else {
        cart.products.push({
          pid,
          quantity: 1,
        });
      }
      await fs.writeFile(this.path, JSON.stringify(cartsList));
      return cart;
    } else {
      return "Error al agregar producto";
    }
  }
}

export default CartManager;
