import {
    getUsers,
    getUser,
    getUserByEmail,
    register,
    login,
    updateUser,
    updateUserPassword,
    deleteUser,
    getLectureList,
    addBookToLectureList,
    deleteFromLectureList,
} from "../../controllers/userController.js";
import requestLogger from "../../utils/requestLogger.js";
import verifyToken from "../../services/authService.js";

function handleUserRoutes(req, res) {
    if (req.url === "/api/users" && req.method === "GET") {
        getUsers(req, res);
    } else if (
        req.url.match(/\/api\/users\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = req.url.split("/")[3];
        getUser(req, res, id);
    } else if (req.url === "/api/users/me" && req.method === "GET") {
        verifyToken(req, res, getUser);
    } else if (req.url.startsWith("/api/users/email") && req.method === "GET") {
        const email = req.url.split("/")[4];
        getUserByEmail(req, res, email);
    } else if (req.url === "/api/users/register" && req.method === "POST") {
        register(req, res);
    } else if (req.url === "/api/users/login" && req.method === "POST") {
        login(req, res);
    } else if (req.url.match(/\/api\/users\/password\/([0-9]+)/) && req.method === "PUT") {
        const id = req.url.split("/")[4];
        updateUserPassword(req, res, id);
    } else if (
        req.url.match(/\/api\/users\/([0-9]+)/) &&
        req.method === "PUT"
    ) {
        const id = req.url.split("/")[3];
        updateUser(req, res, id);
    } else if (
        req.url.match(/\/api\/users\/([0-9]+)/) &&
        req.method === "DELETE"
    ) {
        const id = req.url.split("/")[3];
        deleteUser(req, res, id);
    } else if (
        req.url.match(/\/api\/users\/booklist\?bookId=([0-9]+)/) &&
        req.method === "POST"
    ) {
        const id = req.url.split("=")[1];
        req.bookId = id;
        verifyToken(req, res, addBookToLectureList);
    } else if (req.url === "/api/users/booklist" && req.method === "GET") {
        verifyToken(req, res, getLectureList);
    } else if (
        req.url.match(/\/api\/users\/booklist\?bookId=([0-9]+)/) &&
        req.method === "DELETE"
    ) {
        const id = req.url.split("=")[1];
        req.bookId = id;
        verifyToken(req, res, deleteFromLectureList);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User Route Not Found" }));
        requestLogger(req.method, req.url, 404);
    }
}

export default handleUserRoutes;
