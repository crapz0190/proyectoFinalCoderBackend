import { productsManager } from "../dao/managers/productsManager.js";

class ProductService {
  paginate = async (obj) => {
    const products = await productsManager.paginate(obj);
    return products;
  };

  findById = async (pid) => {
    const products = await productsManager.getById(pid);
    return products;
  };

  createOne = async (obj) => {
    const products = await productsManager.createOne(obj);
    return products;
  };

  updateOne = async (pid, obj) => {
    const products = await productsManager.updateOne(pid, obj);
    return products;
  };

  deleteOne = async (pid) => {
    const products = await productsManager.deleteOne(pid);
    return products;
  };
}
export const productService = new ProductService();
