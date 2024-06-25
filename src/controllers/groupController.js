import * as groupModel from "../models/groupModel.js";
import requestLogger from "../utils/requestLogger.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await groupModel.getGroups();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(groups));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getGroup = async (req, res, id) => {
    try {
        const group = await groupModel.getGroupById(id);
        if (group.length > 0) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(group[0]));
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Group not found" }));
            requestLogger(req.method, req.url, 404);
        }
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const createGroup = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const group = JSON.parse(body);
            await groupModel.createGroup(group);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Group created" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const updateGroup = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const group = JSON.parse(body);
            await groupModel.updateGroup(id, group);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Group updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteGroup = async (req, res, id) => {
    try {
        await groupModel.deleteGroup(id);
        res.writeHead(204, { "Content-Type": "application/json" });
        res.end();
        requestLogger(req.method, req.url, 204);
    } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const joinGroup = async (userId, groupId) => {
    const query = `
        INSERT INTO UsersGroups (userId, groupId)
        VALUES (@userId, @groupId)
    `;
    const params = [
        { name: "userId", type: sql.Int, value: userId },
        { name: "groupId", type: sql.Int, value: groupId },
    ];
    await queryDatabase(query, params);
};
