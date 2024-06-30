import sql from "mssql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { queryDatabase } from "../data/dbConnection.js";
import * as userModel from "../models/userModel.js";
import requestLogger from "../utils/requestLogger.js";
import usernameGenerator from "../utils/usernameGenerator.js";

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
                    profilePicture: user.profilePicture,
                }))
            )
        );
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getUser = async (req, res, id) => {
    try {
        const queryResponse = await userModel.getUserById(id);
        if (queryResponse.length > 0) {
            const user = queryResponse[0];
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                })
            );
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            requestLogger(req.method, req.url, 404);
        }
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
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
                    profilePicture: user.profilePicture,
                })
            );
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            requestLogger(req.method, req.url, 204);
        }
    }
    catch (err) {
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
            const { email, password, username, profilePicture } = JSON.parse(body);
            const hashedPassword = await bcrypt.hash(password, 10);
            await queryDatabase(
                "INSERT INTO Users (password, role, email, username, profilePicture) VALUES (@password, @role, @email, @username, @profilePicture)",
                [
                    { name: "email", type: sql.NVarChar, value: email },
                    {
                        name: "password",
                        type: sql.NVarChar,
                        value: hashedPassword,
                    },
                    { name: "role", type: sql.NVarChar, value: "User" },
                    {
                        name: "username",
                        type: sql.NVarChar,
                        value: username ? username : usernameGenerator(),
                    },
                    {
                        name: "profilePicture",
                        type: sql.NVarChar,
                        value: profilePicture ? profilePicture : null,
                    },
                ]
            );
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User registered" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
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
            const { email, password } = JSON.parse(body);

            const queryResponse = await userModel.getUserByEmail(email);
            const user = queryResponse[0];

            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ token }));
                requestLogger(req.method, req.url, 200);
            } else {
                res.writeHead(401, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid password" }));
                requestLogger(req.method, req.url, 401);
            }
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
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
            const { username, password, role, profilePicture, email } =
                JSON.parse(body);
            const hashedPassword = await bcrypt.hash(password, 10);
            await queryDatabase(
                "UPDATE Users SET username = @username, password = @password, email = @email, role = @role, profilePicture = @profilePicture WHERE id = @id",
                [
                    { name: "username", type: sql.NVarChar, value: username },
                    {
                        name: "password",
                        type: sql.NVarChar,
                        value: hashedPassword,
                    },
                    { name: "role", type: sql.NVarChar, value: role },
                    {
                        name: "profilePicture",
                        type: sql.NVarChar,
                        value: profilePicture,
                    },
                    { name: "email", type: sql.NVarChar, value: email },
                    { name: "id", type: sql.Int, value: id },
                ]
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteUser = async (req, res, id) => {
    try {
        await queryDatabase("DELETE FROM Users WHERE id = @id", [
            { name: "id", type: sql.Int, value: id },
        ]);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
        requestLogger(req.method, req.url, 204);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const addBookToLectureList = async (req, res, userId) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { bookId } = JSON.parse(body);
            await userModel.addBookToLectureList(userId, bookId);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({ message: "Book added to user's lecture list" })
            );
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteFromLectureList = async (req, res, userId) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { bookId } = JSON.parse(body);
            await userModel.addBookToLectureList(userId, bookId);
            await userModel.deleteFromLectureList(userId, bookId);
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end();
            requestLogger(req.method, req.url, 204);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};
