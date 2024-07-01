import * as groupMessageModel from "../models/groupMessageModel.js";
import requestLogger from "../utils/requestLogger.js";

export const getGroupMessages = async (req, res, groupId) => {
    try {
        const groupMessages = await groupMessageModel.getGroupMessages(groupId);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(groupMessages));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getGroupMessage = async (req, res, id) => {
    try {
        const groupMessage = await groupMessageModel.getGroupMessageById(id);
        if (groupMessage.length > 0) {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(groupMessage[0]));
            requestLogger(req.method, req.url, 200);
        } else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "GroupMessage not found" }));
            requestLogger(req.method, req.url, 404);
        }
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const createGroupMessage = async (req, res) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const groupMessage = JSON.parse(body);
            const { groupId, userId, message } = groupMessage;

            const isUserInGroup = await groupMessageModel.isUserInGroup(
                userId,
                groupId
            );
            if (!isUserInGroup) {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({
                        error: "User not a member of the group",
                    })
                );
                requestLogger(req.method, req.url, 403);
                return;
            }

            await groupMessageModel.createGroupMessage({
                groupId,
                userId,
                message,
            });
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Message craeted" }));
            requestLogger(req.method, req.url, 201);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const updateGroupMessage = async (req, res, id) => {
    try {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const groupMessage = JSON.parse(body);
            await groupMessageModel.updateGroupMessage(id, groupMessage);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Message updated" }));
            requestLogger(req.method, req.url, 200);
        });
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const deleteGroupMessage = async (req, res, id) => {
    try {
        await groupMessageModel.deleteGroupMessage(id);
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
