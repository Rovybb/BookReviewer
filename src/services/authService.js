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
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Access denied" }));
        requestLogger(req.method, req.url, 401);
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await next(req, res, decoded.id);
    } catch (error) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid token" }));
        requestLogger(req.method, req.url, 401);
    }
};

export { verifyToken };
