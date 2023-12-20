import { productModel } from "../models/products.models.js";

class ProductManager {
  //Método para obtener todos los productos
  async getProducts(filter, options) {
    const prods = await productModel.paginate(filter, options);
    return prods;
  }

  //Método para obtener un producto específico por su id
  async getProductById(id) {
    const prod = await productModel.findById(id);
    return prod;
  }

  //Método para crear un producto
  async addProduct(title, description, stock, code, price, category) {
    const prod = await productModel.create({
      title,
      description,
      stock,
      code,
      price,
      category,
    });
    return prod;
  }

  //Método para actualizar un producto dado su id
  async updateProduct(
    id,
    title,
    description,
    stock,
    status,
    code,
    price,
    category
  ) {
    const prod = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      stock,
      status,
      code,
      price,
      category,
    });
    return prod;
  }

  //Método para borrar un producto de la colección, dado su id
  async deleteProduct(id) {
    const prod = await productModel.findByIdAndDelete(id);
    return prod;
  }
}

export default ProductManager;
