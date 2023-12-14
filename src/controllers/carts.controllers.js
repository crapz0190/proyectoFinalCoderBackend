import { cartRepository } from "../services/repository/carts.repository.js";
import { productRepository } from "../services/repository/products.repository.js";
import { userRepository } from "../services/repository/users.repository.js";
import { ticketRepository } from "../services/repository/tickets.repository.js";

class CartController {
  // Metodo GET para mostrar todos los carritos
  allCarts = async (req, res) => {
    try {
      const allCarts = await cartRepository.findAll();
      if (allCarts.length === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "Carts not found" });
      } else {
        return res.status(200).json({ status: "success", payload: allCarts });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo GET para encontrar carrito por ID
  cartById = async (req, res) => {
    const { cid } = req.params;
    try {
      const cartById = await cartRepository.findById(cid);
      if (!cartById) {
        return res
          .status(404)
          .json({ status: "error", message: "Cart not found" });
      } else {
        return res.status(200).json({ status: "success", payload: cartById });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo POST para finalizar el proceso de compra
  purchasingProcess = async (req, res) => {
    const { cid } = req.params;
    const idUser = req.user._id;

    try {
      // const cart = await cartsManager.getById(cid);
      const cart = await cartRepository.findById(cid);
      if (!cart || cart.user.toString() !== idUser.toString()) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const productsToPurchase = cart.products;

      // Verificar el stock y realizar la compra
      const productsNotPurchased = await Promise.all(
        productsToPurchase.map(async (productInCart) => {
          const product = await productRepository.findById(
            productInCart.product
          );

          if (!product || product.stock < productInCart.quantity) {
            return productInCart.product;
          }

          // Restar la cantidad del stock
          product.stock -= productInCart.quantity;
          await product.save();

          return null;
        })
      );

      // Filtrar los productos que no se pudieron comprar
      const failedPurchaseProducts = productsNotPurchased.filter(
        (productId) => productId !== null
      );

      const userFound = await userRepository.findById(cart.user);

      // Generar el ticket
      const ticketData = {
        amount: calculateTotalAmount(productsToPurchase),
        purchaser: userFound.email,
      };

      function calculateTotalAmount(products) {
        return products.reduce((total, productInCart) => {
          // Verificar si el producto tiene stock suficiente
          if (productInCart.product.stock >= productInCart.quantity) {
            return total + productInCart.product.price * productInCart.quantity;
          }
          return total;
        }, 0);
      }

      const ticket = await ticketRepository.createTicket(ticketData);

      // Actualizar el carrito con los productos no comprados
      cart.products = productsToPurchase.filter((productInCart) =>
        failedPurchaseProducts.includes(productInCart.product)
      );
      await cart.save();

      return res
        .status(200)
        .json({ message: "Successful purchase", ticket: ticket });
    } catch (e) {
      console.error("Error before generating the ticket:", e);
      return res.status(500).json({ error: e.message });
    }
  };

  // Metodo POST para crear un carrito
  createCart = async (req, res) => {
    try {
      const createCart = await cartRepository.createOne();
      if (!createCart) {
        return res
          .status(500)
          .json({ status: "error", error: "Could not create cart" });
      } else {
        return res.status(200).json({ status: "success", payload: createCart });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo PUT para agregar productos a un carrito
  updateCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (typeof cid !== "string" || typeof pid !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid input data" });
    }
    try {
      const updateCart = await cartRepository.updateCart(
        cid,
        pid,
        +quantity,
        userId
      );
      return res.status(200).json({ status: "success", payload: updateCart });
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo DELETE para eliminar un carrito
  removeCart = async (req, res) => {
    const { cid } = req.params;

    const foundId = await cartRepository.findById(cid);
    if (!foundId) {
      return res
        .status(404)
        .json({ status: "error", message: "Cart not found" });
    }

    try {
      const removeCart = await cartRepository.deleteOne(cid);
      if (!removeCart) {
        return res
          .status(500)
          .json({ status: "error", message: "Product removal failed" });
      } else {
        return res.status(200).json({ status: "success", payload: removeCart });
      }
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };

  // Metodo DELETE para eliminar un  producto del carrito
  removeProductByCart = async (req, res) => {
    const { cid, pid } = req.params;

    if (typeof cid !== "string" || typeof pid !== "string") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid input data" });
    }
    try {
      const removeProductByCart = await cartRepository.deleteProductByCart(
        cid,
        pid
      );
      return res.status(200).json({
        status: "Product removed from cart",
        payload: removeProductByCart,
      });
    } catch (e) {
      return res.status(500).json({ status: "error", error: e.message });
    }
  };
}

export const cartController = new CartController();
