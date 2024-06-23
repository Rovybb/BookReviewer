import * as http from "node:http";
import { pageRouter } from "./routers/pageRouter.js";

const PORT = 3000;

http.createServer(async (req, res) => {
    const url = req.url;

    if (url.includes("/api")) {
        // API
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Hello World" }));
    } else {
        await pageRouter(req, res);
    }
}).listen(PORT);

console.log(`Server running on http://localhost:${PORT}`);