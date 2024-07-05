import * as fs from "node:fs";
import * as path from "node:path";
import jwt from "jsonwebtoken";
import requestLogger from "../utils/requestLogger.js";
import { IncomingMessage, ServerResponse } from "node:http";
import bookPageGenerator from "./generators/bookPageGenerator.js";
import groupPageGenerator from "./generators/groupPageGenerator.js";
import ratingStarsCssGenerator from "./generators/ratingStarsCssGenerator.js";
import errorPageTemplate from "./generators/templates/errorPageTemplate.js";

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
    xml: "application/xml",
};

const protectedRoutes = ["/profile"];

const resolveUrl = (url) => {
    if (url === "/" || url === "") {
        return "./views/index.html";
    } else if (url === "/about") {
        return "./views/about.html";
    } else if (url === "/help") {
        return "./views/help.html";
    } else if (url === "/profile") {
        return "./views/profile.html";
    } else if (url === "/login") {
        return "./views/login.html";
    } else if (url === "/register") {
        return "./views/register.html";
    } else if (url === "/books") {
        return "./views/books.html";
    }  else if (url === "/groups") {
        return "./views/groups.html";
    } else if (url === "/documentation") {
        return "./views/doc.html";
    } else if (url === "/admin") {
        return "./views/admin.html";
    } else {
        return url;
    }
};

const SRC_PATH = path.join(process.cwd(), "./src/static");

const prepareFile = async (url) => {
    const paths = [SRC_PATH, resolveUrl(url)];
    const filePath = path.join(...paths);
    const toBool = [() => true, () => false];
    const found = await fs.promises.access(filePath).then(...toBool);
    // console.log(`Found: ${found}, Path: ${filePath}`);               // Uncomment for debugging
    if (found) {
        const ext = path.extname(filePath).substring(1).toLowerCase();
        const stream = fs.createReadStream(filePath);
        return { found, ext, stream };
    }
    return { found: false, ext: "", stream: null };
};

export const sendData = async (req, res) => {
    const file = await prepareFile(req.url);
    if (!file.found) {
        res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
        res.end(errorPageTemplate({
            title: "Page Not found",
            message: "You are trying to access an invalid link.<br><a href='/'>Return to home page</a>",
        }));
        requestLogger(req.method, req.url, 404);
        return;
    }
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(200, { "Content-Type": mimeType });
    file.stream.pipe(res);
    requestLogger(req.method, req.url, 200);
};

const handleProtectedRoutes = async (req, res, adminPermision) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.writeHead(401, { "Content-Type": "text/html; charset=UTF-8" });
        res.end(errorPageTemplate({
            title: "Unauthorized",
            message: "You are not authorized to access this page.<br><a href='/login'>Try to login</a>"
        }));
        requestLogger(req.method, req.url, 401);
        return;
    }

    let token;
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
        token = tokenCookie.split("=")[1];
    } else {
        res.writeHead(401, { "Content-Type": "text/html; charset=UTF-8" });
        res.end(errorPageTemplate({
            title: "Unauthorized",
            message: "You are not authorized to access this page.<br><a href='/login'>Try to login</a>"
        }));
        requestLogger(req.method, req.url, 401);
        return;
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        if (adminPermision && jwt.decode(token).role !== "Admin") {
            res.writeHead(403, { "Content-Type": "text/html; charset=UTF-8" });
            res.end(errorPageTemplate({
                title: "Forbidden",
                message: "You are not authorized to access this page.<br><a href='/'>Return to home page</a>"
            }));
            requestLogger(req.method, req.url, 403);
            return;
        }
        await sendData(req, res);
    } catch (error) {
        console.error(error);
        res.writeHead(401, { "Content-Type": "text/html; charset=UTF-8" });
        res.end(errorPageTemplate({
            title: "Unauthorized",
            message: "You are not authorized to access this page.<br><a href='/login'>Try to login</a>"
        }));
        requestLogger(req.method, req.url, 401);
    }
};

/**
 * Router for handling static files and pages
 * @param {IncomingMessage} req Client request
 * @param {ServerResponse<IncomingMessage>} res Server response
 */
const pageRouter = async (req, res) => {
    if (req.url.startsWith("/admin")) {
        await handleProtectedRoutes(req, res, true);
    } else if (protectedRoutes.includes(req.url)) {
        await handleProtectedRoutes(req, res, false);
    } else if (req.url.match(/\/books\/([0-9]+)\/index.css/)) {
        await ratingStarsCssGenerator(req, res);
    } else if (req.url.match(/\/books\/([0-9]+)/)) {
        await bookPageGenerator(req, res);
    } else if (req.url.match(/\/groups\/([0-9]+)/)) {
        await groupPageGenerator(req, res);
    } else if (req.url.match(/\/groups\/([0-9]+)/)) {
        await sendData(req, res);
    } else await sendData(req, res);
};

export default pageRouter;
