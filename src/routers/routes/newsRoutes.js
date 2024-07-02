import {
    getNews,
    getNewsById,
    addNews,
    updateNews,
    deleteNews
} from "../controllers/newsController.js";
import requestLogger from "../utils/requestLogger.js";

const handleNewsRoutes = (req, res) => {
    if (req.url === "/api/news" && req.method === "GET") {
        getNews(req, res);
    } else if (req.url.match(/\/api\/news\/([0-9]+)/) && req.method === "GET") {
        const id = req.url.split("/")[3];
        getNew(req, res, id);
    } else if (req.url === "/api/news" && req.method === "POST") {
        addNews(req, res);
    } else if (req.url.match(/\/api\/news\/([0-9]+)/) && req.method === "PUT") {
        const id = req.url.split("/")[3];
        updateNews(req, res, id);
    } else if (req.url.match(/\/api\/news\/([0-9]+)/) && req.method === "DELETE") {
        const id = req.url.split("/")[3];
        deleteNews(req, res, id);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "News Route Not Found" }));
        requestLogger(req.method, req.url, 404);
    }
};

export default handleNewsRoutes;