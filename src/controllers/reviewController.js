import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";
import requestLogger from "../utils/requestLogger.js";

export const getReviews = async (req, res) => {
    try {
        const reviews = await queryDatabase("SELECT * FROM Reviews");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(reviews));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getReview = async (req, res, id) => {
    try {
        const review = await queryDatabase(
            "SELECT * FROM Reviews WHERE id = @id",
            [{ name: "id", type: sql.Int, value: id }]
        );
        if (review.length > 0) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(review[0]));
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Review not found" }));
            requestLogger(req.method, req.url, 404);
        }
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const addReview = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { rating, description, bookId, userId } = JSON.parse(body);
            const query = `
                INSERT INTO Reviews (rating, description, bookId, userId, createdAt)
                VALUES (@rating, @description, @bookId, @userId, @createdAt);
                SELECT SCOPE_IDENTITY() AS id;
            `;
            const params = [
                { name: "rating", type: sql.Int, value: rating },
                { name: "description", type: sql.NVarChar, value: description },
                { name: "bookId", type: sql.Int, value: bookId },
                { name: "userId", type: sql.Int, value: userId },
                { name: "createdAt", type: sql.DateTime, value: new Date() },
            ];
            const result = await queryDatabase(query, params);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ message: "Review added", id: result[0].id })
            );
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const updateReview = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { rating, description, bookId, userId } = JSON.parse(body);
            const query = `
                UPDATE Reviews
                SET rating = @rating, description = @description, bookId = @bookId, userId = @userId
                WHERE id = @id
            `;
            const params = [
                { name: "rating", type: sql.Int, value: rating },
                { name: "description", type: sql.NVarChar, value: description },
                { name: "bookId", type: sql.Int, value: bookId },
                { name: "userId", type: sql.Int, value: userId },
                { name: "id", type: sql.Int, value: id },
            ];
            await queryDatabase(query, params);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Review updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteReview = async (req, res, id) => {
    try {
        await queryDatabase("DELETE FROM Reviews WHERE id = @id", [
            { name: "id", type: sql.Int, value: id },
        ]);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
        requestLogger(req.method, req.url, 204);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};
