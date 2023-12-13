// import server from "./app.js";
import { serverConfig } from "./controllers/middlewares.controllers.js";
import env from "./dotenv.js";
import database from "./dao/database.js";

serverConfig.middlewares();
serverConfig.handlebars();
serverConfig.routes();
serverConfig.socket();

database();
serverConfig.server.listen(env.PORT, () => {
  console.log(`Server on port: http://localhost:${env.PORT}/login`);
});
