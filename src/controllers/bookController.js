import * as bookModel from "../models/bookModel.js";
import requestLogger from "../utils/requestLogger.js";
import {
    uploadImage,
    buildUrl,
    deleteImage,
} from "../services/imageUploadService.js";

export const searchBooks = async (req, res, search, genre) => {
    try {
        const books = await bookModel.searchBooks(
            search.split("%20").join(" "),
            genre.split("%20").join(" ")
        );
        books.forEach((book) => {
            book.imageLink = buildUrl("books", book.imageLink);
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(books));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getBook = async (req, res, id) => {
    try {
        const book = await bookModel.getBookById(id);
        if (book.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Book not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        book[0].imageLink = buildUrl("books", book[0].imageLink);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(book[0]));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
            let book;
            try {
                book = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            await bookModel.addBook({
                title: book.title,
                author: book.author,
                genre: book.genre,
                imageLink: await uploadImage(book.imageLink, "books"),
                description: book.description,
                rating: 0,
            });
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book added" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
            const book = JSON.parse(body);
            const bookQuery = await bookModel.getBookById(id);
            if (bookQuery.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Book not found" }));
                requestLogger(req.method, req.url, 404);
                return;
            }
            if (book.imageLink) {
                if (bookQuery[0].imageLink) {
                    await deleteImage("books", bookQuery[0].imageLink);
                }
                book.imageLink = await uploadImage(book.imageLink, "books");
            }
            await bookModel.updateBook(id, book);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Book updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteBook = async (req, res, id) => {
    try {
        const book = await bookModel.getBookById(id);
        if (book.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Book not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        if (book[0].imageLink) {
            await deleteImage("books", book[0].imageLink);
        }
        await bookModel.deleteBook(id);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
        requestLogger(req.method, req.url, 204);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};
