import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import { join } from "node:path";
import dirname from "../utils.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import env from "../dotenv.js";
import passport from "passport";
import "../passport.js";
import viewsRouter from "../routes/views.routes.js";
import productsRouter from "../routes/products.routes.js";
import cartsRouter from "../routes/carts.routes.js";
import messagesRouter from "../routes/messages.routes.js";
import sessionsRouter from "../routes/sessions.routes.js";
import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";
import { productsModel } from "../dao/models/products.model.js";
import { productsManager } from "../dao/managers/productsManager.js";
import methodOverride from "method-override";

class ServerConfig {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server);
  }
  middlewares = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(join(dirname, "public")));
    this.app.use("/images", express.static(join(dirname, "public", "images")));
    this.app.use(morgan("dev"));
    this.app.use(cookieParser());
    this.app.use(methodOverride("_method"));

    // session MongoStore
    this.app.use(
      session({
        store: new MongoStore({
          mongoUrl: env.URI,
        }),
        secret: env.TOKEN_SECRET_MONGO,
        cookie: { maxAge: 3600000 },
        // saveUninitialized: false,
      })
    );

    // passport
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  };

  handlebars = () => {
    this.app.engine(".hbs", engine({ extname: ".hbs" }));
    this.app.set("view engine", ".hbs");
    this.app.set("views", join(dirname, "views"));
  };

  routes = () => {
    // routes
    this.app.use("/", viewsRouter);
    this.app.use("/api/products", productsRouter);
    this.app.use("/api/carts", cartsRouter);
    this.app.use("/api/messages", messagesRouter);
    this.app.use("/api/sessions", sessionsRouter);
  };

  socket = () => {
    this.io.on("connection", (socketServer) => {
      console.log(`New client connected: ${socketServer.id}`);

      // -------------  INICIO actualizar/eliminar producto  -------------
      socketServer.on("idUpdateProducts", async (data) => {
        const pid = data.productId;

        const idFound = await productsManager.getById(pid);
        socketServer.emit("loadListProducts", idFound);
      });

      socketServer.on("updateListProducts", async (update) => {
        const id = update.idProductForm;
        await productsManager.updateOne(id, update);
      });

      socketServer.on("idDeleteProducts", async (data) => {
        const pid = data.productId;
        const deleteProduct = await productsManager.deleteOne(pid);
        socketServer.emit("loadListProducts", deleteProduct);
      });

      // ------------------ agregar producto a carrito ----------------
      socketServer.on("add-to-cart", async (data) => {
        console.log(data.productId);
        const pid = data.productId;
        try {
          const product = await productsModel.getById({ _id: pid });
          console.log("product--->", product);
        } catch (e) {
          console.error(e.message);
        }
      });
    });
  };

  server = () => {
    return this.server;
  };
}

export const serverConfig = new ServerConfig();
