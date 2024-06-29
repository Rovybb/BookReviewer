import jwt from "jsonwebtoken";
import requestLogger from "../utils/requestLogger.js";
import { IncomingMessage, ServerResponse } from "node:http";

/**
 * Verifies the token in the request header and sets the decoded user ID in the request object.
 * If the token is invalid or missing, it sends an appropriate error response.
 *
 * @param {IncomingMessage} req - The request object.
 * @param {ServerResponse<IncomingMessage>} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Access denied" }));
        requestLogger(req.method, req.url, 403);
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next(req, res, decoded);
    } catch (error) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid token" }));
        requestLogger(req.method, req.url, 401);
    }
};

export { verifyToken };
