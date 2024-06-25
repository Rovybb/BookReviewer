import "dotenv/config";
import * as http from "node:http";
import pageRouter from "./routers/pageRouter.js";
import { createConnection } from "./data/dbConnection.js";
import handleAPIRoutes from "./routers/apiRouter.js";

await createConnection();

http.createServer(async (req, res) => {
    if (req.url.startsWith("/api")) {
        await handleAPIRoutes(req, res);
    } else {
        await pageRouter(req, res);
    }
}).listen(process.env.PORT, () => console.log(`\nServer running on \x1b[34mhttp://localhost:${process.env.PORT}\x1b[0m`));