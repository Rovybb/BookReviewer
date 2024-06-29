import * as fs from "node:fs";
import * as path from "node:path";
import requestLogger from "../utils/requestLogger.js";
import { IncomingMessage, ServerResponse } from "node:http";

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
        return "./views/register_step1.html";
    } else if (url.includes("/register/appearance")) {
        return "./views/register_step2.html";
    } else if (url === "/books") {
        return "./views/books.html";
    } else if (url.includes("/books/") && !url.includes(".css")) {
        return "./views/book_page.html";
    } else if (url === "/groups") {
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

/**
 * Router for handling static files and pages
 * @param {IncomingMessage} req Client request
 * @param {ServerResponse<IncomingMessage>} res Server response
 */
const pageRouter = async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    requestLogger(req.method, req.url, statusCode);
};

export default pageRouter;
