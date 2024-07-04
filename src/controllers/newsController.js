import * as newsModel from "../models/newsModel.js";
import requestLogger from "../utils/requestLogger.js";

export const getNews = async (req, res) => {
    try {
        const news = await newsModel.getNews();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(news));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
}

export const getNewsById = async (req, res, id) => {
    try {
        const news = await newsModel.getNewsById(id);
        if (news.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "News not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(news));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
}

export const addNews = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let news;
            try {
                news = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            await newsModel.addNews(news);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "News added" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
}

export const updateNews = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let news;
            try {
                news = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            const newsToUpdate = await newsModel.getNewsById(id);
            if (newsToUpdate.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "News not found" }));
                requestLogger(req.method, req.url, 404);
                return;
            }
            await newsModel.updateNews(id, news);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "News updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
}

export const deleteNews = async (req, res, id) => {
    try {
        const newsToDelete = await newsModel.getNewsById(id);
        if (newsToDelete.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "News not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        await newsModel.deleteNews(id);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
        requestLogger(req.method, req.url, 204);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
}
