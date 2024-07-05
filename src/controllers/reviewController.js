import * as reviewModel from "../models/reviewModel.js";
import requestLogger from "../utils/requestLogger.js";
import { updateBookRating } from "../models/bookModel.js";

export const getReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.getReviews();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(reviews));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getReview = async (req, res, id) => {
    try {
        const review = await reviewModel.getReviewById(id);
        if (review.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Review not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(review[0]));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getReviewsByBookId = async (req, res, bookId) => {
    try {
        await updateBookRating(bookId);
        const reviews = await reviewModel.getReviewsByBookId(bookId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(reviews));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getReviewByBookIdAndUserId = async (req, res, bookId, userId) => {
    try {
        const review = await reviewModel.getReviewByBookIdAndUserId(bookId, userId);
        if (review.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Review not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(review[0]));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
            let review;
            try {
                review = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            const existingReview = await reviewModel.getReviewByBookIdAndUserId(
                review.bookId,
                req.userId
            );
            if (existingReview.length > 0) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Review already exists" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            await reviewModel.addReview({ ...review, userId: req.userId });
            await updateBookRating(review.bookId);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Review added" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
            let review;
            try {
                review = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            await reviewModel.updateReview(id, review);
            await updateBookRating(review.bookId);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Review updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteReview = async (req, res, id) => {
    try {
        await reviewModel.deleteReview(id);
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
