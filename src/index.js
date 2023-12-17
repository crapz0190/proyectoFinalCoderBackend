import server from "./controllers/serverConfig.controllers.js";
import env from "./utils/dotenv.js";
import database from "./config/database.js";

server.middlewares();
server.handlebars();
server.routes();
server.socket();

database();
server.server.listen(env.PORT, () => {
  console.log(`Server on port: http://localhost:${env.PORT}/login`);
});
