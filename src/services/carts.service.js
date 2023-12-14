import { cartsManager } from "../dao/managers/cartsManager.js";

class CartService {
  findAll = async () => {
    const carts = await cartsManager.getAll();
    return carts;
  };

  findById = async (cid) => {
    const carts = await cartsManager.getById(cid);
    return carts;
  };

  createOne = async () => {
    const carts = await cartsManager.createCart();
    return carts;
  };

  updateCart = async (cid, pid, quantity, userId) => {
    const carts = await cartsManager.addProductsByCart(
      cid,
      pid,
      quantity,
      userId
    );
    return carts;
  };

  deleteOne = async (cid) => {
    const carts = await cartsManager.deleteOne(cid);
    return carts;
  };

  deleteProductByCart = async (cid, pid) => {
    const carts = await cartsManager.deleteProductByCart(cid, pid);
    return carts;
  };
}
export const cartService = new CartService();
