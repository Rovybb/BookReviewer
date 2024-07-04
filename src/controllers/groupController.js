import * as groupModel from "../models/groupModel.js";
import requestLogger from "../utils/requestLogger.js";
import {
    uploadImage,
    buildUrl,
    deleteImage,
} from "../services/imageUploadService.js";

export const getGroups = async (req, res) => {
    try {
        const groups = await groupModel.getGroups();
        groups.forEach((group) => {
            group.imageLink = buildUrl("groups", group.imageLink);
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(groups));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getGroup = async (req, res, id) => {
    try {
        const group = await groupModel.getGroupById(id);
        if (group.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Group not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        group[0].imageLink = buildUrl("groups", group[0].imageLink);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(group[0]));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
            let group;
            try {
                group = JSON.parse(body);
            }
            catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            group.imageLink = await uploadImage(group.imageLink, "groups");
            await groupModel.createGroup(group);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Group created" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
            let group;
            try {
                group = JSON.parse(body);
            }
            catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            await groupModel.updateGroup(id, group);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Group updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
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
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const joinGroup = async (req, res, id) => {
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
            const userId = user.userId;
            await groupModel.joinGroup(userId, id);
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User joined group" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};
