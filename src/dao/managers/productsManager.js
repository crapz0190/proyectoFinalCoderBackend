import { productsModel } from "../models/products.model.js";
import BasicManager from "./basicManager.js";
import env from "../../dotenv.js";

class ProductsManager extends BasicManager {
  constructor() {
    super(productsModel);
  }

  async paginate(obj) {
    const { limit = 10, page = 1, order = 0, ...query } = obj;
    let sort;
    if (+order === 1) {
      sort = "price";
    } else if (+order === -1) {
      sort = "-price";
    }

    try {
      const result = await productsModel.paginate(query, {
        limit,
        page,
        sort,
        lean: true,
      });
      // console.log(result);
      const info = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `http://localhost:${env.PORT}/products?limit=${limit}&page=${result.prevPage}`
          : null,
        nextLink: result.hasNextPage
          ? `http://localhost:${env.PORT}/products?limit=${limit}&page=${result.nextPage}`
          : null,
      };
      return info;
    } catch (error) {
      console.error(error.message);
      return { status: "error" };
    }
  }
}

export const productsManager = new ProductsManager();
