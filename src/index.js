// import server from "./app.js";
import { serverConfig } from "./controllers/serverConfig.controllers.js";
import { database, confEnv } from "./config.js";

serverConfig.middlewares();
serverConfig.handlebars();
serverConfig.routes();
serverConfig.socket();

database();
serverConfig.server.listen(confEnv.PORT, () => {
  console.log(`Server on port: http://localhost:${confEnv.PORT}/login`);
});
