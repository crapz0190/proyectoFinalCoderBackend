import { cartsModel } from "../models/carts.model.js";
import BasicManager from "./basicManager.js";

class CarsManager extends BasicManager {
  constructor() {
    super(cartsModel, ["products.product"]);
  }

  async createCart() {
    try {
      const newCart = { products: [] };
      const createCart = await cartsModel.create(newCart);
      return createCart;
    } catch (error) {
      console.error(error);
    }
  }

  async addProductsByCart(cid, pid, quantity, userId) {
    try {
      const cart = await cartsModel.findById(cid);

      if (!cart.user) {
        cart.user = userId;
      }

      const foundIndex = cart.products.findIndex((item) =>
        item.product.equals(pid)
      );
      if (foundIndex === -1) {
        cart.products.push({ product: pid, quantity: quantity });
      } else {
        cart.products[foundIndex].quantity = quantity;
      }
      return cart.save();
    } catch (error) {
      console.error(error);
    }
  }

  async deleteProductByCart(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      const foundIndex = cart.products.findIndex((item) =>
        item.product.equals(pid)
      );
      if (foundIndex !== -1) {
        cart.products.splice(foundIndex, 1);
        await cart.save();
      } else {
        console.error("Producto no encontrado en el carrito");
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export const cartsManager = new CarsManager();
