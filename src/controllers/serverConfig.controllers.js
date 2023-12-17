import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import { join } from "node:path";
import dirname from "../utils/dirname.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import env from "../utils/dotenv.js";
import passport from "passport";
import "../config/passport.js";
import viewsRouter from "../routes/views.routes.js";
import productsRouter from "../routes/products.routes.js";
import cartsRouter from "../routes/carts.routes.js";
import messagesRouter from "../routes/messages.routes.js";
import sessionsRouter from "../routes/sessions.routes.js";
import { productRepository } from "../services/repository/products.repository.js";
import { createServer } from "node:http";
import { Server as SocketServer } from "socket.io";
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

      // -------------  actualizar/eliminar producto  -------------
      socketServer.on("idUpdateProducts", async (data) => {
        const pid = data.productId;

        const idFound = await productRepository.findById(pid);
        socketServer.emit("loadListProducts", idFound);
      });

      socketServer.on("updateListProducts", async (update) => {
        const id = update.idProductForm;
        await productRepository.updateOne(id, update);
      });

      socketServer.on("idDeleteProducts", async (data) => {
        const pid = data.productId;
        const deleteProduct = await productRepository.deleteOne(pid);
        socketServer.emit("loadListProducts", deleteProduct);
      });
    });
  };

  server = () => {
    return this.server;
  };
}

export default new ServerConfig();
