import 'dotenv/config';
import * as http from "node:http";
import pageRouter from "./routers/pageRouter.js";
import requestLogger from "./utils/requestLogger.js";
import createConnection from "./data/dbConnection.js";
import createFeed, { items } from "./utils/createFeed.js";

await createConnection();

http.createServer(async (req, res) => {
    const url = req.url;
    if (url === "/rss.xml") {
        // RSS
        res.writeHead(200, { "Content-Type": "application/xml" });
        res.write(createFeed(items));
        res.end();
        requestLogger(req.method, url, 200);
    } else if (url.includes("/api")) {
        // API
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ message: "Hello World" }));
        res.end();
        requestLogger(req.method, url, 200);
    } else {
        // Pages
        await pageRouter(req, res);
    }
}).listen(process.env.PORT, () => console.log(`\nServer running on \x1b[34mhttp://localhost:${process.env.PORT}\x1b[0m`));