import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import { getBookById } from "../models/bookModel.js";
import requestLogger from "../utils/requestLogger.js";
import usernameGenerator from "../utils/usernameGenerator.js";
import {
    uploadImage,
    buildUrl,
    deleteImage,
} from "../services/imageUploadService.js";

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.getUsers();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify(
                users.map((user) => ({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePicture: buildUrl(
                        "profilePictures",
                        user.profilePicture
                    ),
                }))
            )
        );
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getUser = async (req, res, id) => {
    try {
        const queryResponse = await userModel.getUserById(id || req.userId);
        if (queryResponse.length > 0) {
            const user = queryResponse[0];
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePicture: buildUrl(
                        "profilePictures",
                        user.profilePicture
                    ),
                })
            );
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "User not found" }));
            requestLogger(req.method, req.url, 404);
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getUserByEmail = async (req, res, email) => {
    try {
        const userRes = await userModel.getUserByEmail(email);
        if (userRes.length > 0) {
            const user = userRes[0];
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePicture: buildUrl(
                        "profilePictures",
                        user.profilePicture
                    ),
                })
            );
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            requestLogger(req.method, req.url, 204);
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const register = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let user;
            try {
                user = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            const { username, email, password, profilePicture } = user;
            const sameEmailUser = await userModel.getUserByEmail(email);
            if (sameEmailUser.length > 0) {
                res.writeHead(409, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Email already in use" }));
                requestLogger(req.method, req.url, 409);
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await userModel.addUser({
                username: username || usernameGenerator(),
                email: email,
                password: hashedPassword,
                role: "User",
                profilePicture: profilePicture
                    ? await uploadImage(profilePicture, "profilePictures")
                    : null,
            });
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User registered" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const login = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let creds;
            try {
                creds = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            const { email, password } = creds;
            const queryResponse = await userModel.getUserByEmail(email);
            const user = queryResponse[0];

            if (!user) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid password or email" }));
                requestLogger(req.method, req.url, 401);
                return;
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid password or email" }));
                requestLogger(req.method, req.url, 401);
                return;
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ token }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const updateUser = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            let user;
            try {
                user = JSON.parse(body);
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            const { username, password, profilePicture, email } = user;
            const userToUpdate = await userModel.getUserById(id);
            if (userToUpdate.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "User not found" }));
                requestLogger(req.method, req.url, 404);
                return;
            }
            const validPassword = await bcrypt.compare(
                password,
                userToUpdate[0].password
            );
            if (!validPassword) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid password" }));
                requestLogger(req.method, req.url, 401);
                return;
            }
            let newImageLink = userToUpdate[0].profilePicture;
            if (profilePicture) {
                if (userToUpdate[0].profilePicture) {
                    await deleteImage(
                        "profilePictures",
                        userToUpdate[0].profilePicture
                    );
                }
                newImageLink = await uploadImage(
                    profilePicture,
                    "profilePictures"
                );
            }
            await userModel.updateUser(id, {
                username: username,
                email: email,
                profilePicture: newImageLink,
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const updateUserPassword = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { oldPassword, newPassword } = JSON.parse(body);
            const user = await userModel.getUserById(id);
            if (user.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "User not found" }));
                requestLogger(req.method, req.url, 404);
                return;
            }
            const validPassword = await bcrypt.compare(
                oldPassword,
                user[0].password
            );
            if (!validPassword) {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid password" }));
                requestLogger(req.method, req.url, 401);
                return;
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await userModel.updateUserPassword(id, hashedPassword);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Password updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteUser = async (req, res, id) => {
    try {
        const user = await userModel.getUserById(id);
        if (user.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "User not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        if (user[0].profilePicture) {
            await deleteImage("profilePictures", user[0].profilePicture);
        }
        await userModel.deleteUser(id);
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

export const getLectureList = async (req, res) => {
    try {
        const books = await userModel.getLectureList(req.userId);
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

export const addBookToLectureList = async (req, res) => {
    try {
        const book = await getBookById(req.bookId);
        if (book.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Book not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        const userBook = await userModel.getBookFromLectureList(
            req.userId,
            req.bookId
        );
        if (userBook.length > 0) {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ error: "Book already in user's lecture list" })
            );
            requestLogger(req.method, req.url, 409);
            return;
        }
        await userModel.addBookToLectureList(req.userId, req.bookId);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({ message: "Book added to user's lecture list" })
        );
        requestLogger(req.method, req.url, 201);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteFromLectureList = async (req, res) => {
    try {
        const book = await getBookById(req.bookId);
        if (book.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Book not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        const userBook = await userModel.getBookFromLectureList(
            req.userId,
            req.bookId
        );
        if (userBook.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ error: "Book not in user's lecture list" })
            );
            requestLogger(req.method, req.url, 404);
            return;
        }
        await userModel.deleteFromLectureList(req.userId, req.bookId);
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
