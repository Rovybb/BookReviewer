import * as fs from "node:fs";
import * as path from "node:path";
import jwt from "jsonwebtoken";
import requestLogger from "../utils/requestLogger.js";
import { IncomingMessage, ServerResponse } from "node:http";
import bookPageGenerator from "./generators/bookPageGenerator.js";

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
    } else if (url.includes("/groups/") && !url.includes(".css")) {
        return "./views/group_page.html";
    } else if (url === "/documentation") {
        return "./views/doc.html";
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
    const streamPath = found ? filePath : SRC_PATH + "/views/404.html";
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

export const sendData = async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    requestLogger(req.method, req.url, statusCode);
};

const handleProtectedRoutes = async (req, res) => {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized");
        requestLogger(req.method, req.url, 401);
        return;
    }

    let token;
    const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));

    if (tokenCookie) {
        token = tokenCookie.split("=")[1];
    } else {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized");
        requestLogger(req.method, req.url, 401);
        return;
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        await sendData(req, res);
    } catch (error) {
        res.writeHead(401, { "Content-Type": "text/plain" });
        res.end("Unauthorized");
        requestLogger(req.method, req.url, 401);
    }
};

/**
 * Router for handling static files and pages
 * @param {IncomingMessage} req Client request
 * @param {ServerResponse<IncomingMessage>} res Server response
 */
const pageRouter = async (req, res) => {
    if (protectedRoutes.includes(req.url)) {
        await handleProtectedRoutes(req, res);
    } else if (req.url.match(/\/books\/([0-9]+)/)) {
        await bookPageGenerator(req, res);
    } else if (req.url.match(/\/groups\/([0-9]+)/)) {
        await sendData(req, res);
    } else await sendData(req, res);
};

export default pageRouter;
