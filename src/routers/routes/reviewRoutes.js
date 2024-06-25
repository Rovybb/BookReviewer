import {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview,
} from "../../controllers/reviewController.js";
import requestLogger from "../../utils/requestLogger.js";

const handleReviewRoutes = (req, res) => {
    if (req.url === "/api/reviews" && req.method === "GET") {
        getReviews(req, res);
    } else if (
        req.url.match(/\/api\/reviews\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = req.url.split("/")[3];
        getReview(req, res, id);
    } else if (req.url === "/api/reviews" && req.method === "POST") {
        addReview(req, res);
    } else if (
        req.url.match(/\/api\/reviews\/([0-9]+)/) &&
        req.method === "PUT"
    ) {
        const id = req.url.split("/")[3];
        updateReview(req, res, id);
    } else if (
        req.url.match(/\/api\/reviews\/([0-9]+)/) &&
        req.method === "DELETE"
    ) {
        const id = req.url.split("/")[3];
        deleteReview(req, res, id);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Review Route Not Found" }));
        requestLogger(req.method, req.url, 404);
    }
};

export default handleReviewRoutes;
