import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";
import requestLogger from "../utils/requestLogger.js";

export const getBooks = async (req, res) => {
    try {
        const books = await queryDatabase("SELECT * FROM Books");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(books));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getBook = async (req, res, id) => {
    try {
        const book = await queryDatabase("SELECT * FROM Books WHERE id = @id", [
            { name: "id", type: sql.Int, value: id },
        ]);
        if (book.length > 0) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(book[0]));
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book not found" }));
            requestLogger(req.method, req.url, 404);
        }
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const addBook = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { title, author, genre, imageLink, rating } =
                JSON.parse(body);
            await queryDatabase(
                "INSERT INTO Books (title, author, genre, imageLink, rating) VALUES (@title, @author, @genre, @imageLink, @rating)",
                [
                    { name: "title", type: sql.NVarChar, value: title },
                    { name: "author", type: sql.NVarChar, value: author },
                    { name: "genre", type: sql.NVarChar, value: genre },
                    { name: "imageLink", type: sql.NVarChar, value: imageLink },
                    { name: "rating", type: sql.Float, value: rating },
                ]
            );
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book added" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const updateBook = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { title, author, genre, imageLink, rating } =
                JSON.parse(body);
            await queryDatabase(
                "UPDATE Books SET title = @title, author = @author, genre = @genre, imageLink = @imageLink, rating = @rating WHERE id = @id",
                [
                    { name: "title", type: sql.NVarChar, value: title },
                    { name: "author", type: sql.NVarChar, value: author },
                    { name: "genre", type: sql.NVarChar, value: genre },
                    { name: "imageLink", type: sql.NVarChar, value: imageLink },
                    { name: "rating", type: sql.Float, value: rating },
                    { name: "id", type: sql.Int, value: id },
                ]
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteBook = async (req, res, id) => {
    try {
        await queryDatabase("DELETE FROM Books WHERE id = @id", [
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
