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
        groups.forEach(async (group) => {
            group.imageLink = buildUrl("groups", group.imageLink);
            group.memberCount = await groupModel.getMembersCount(group.id);
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
        group[0].memberCount = await groupModel.getMembersCount(group[0].id);
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

export const searchGroups = async (req, res, search) => {
    try {
        const groups = await groupModel.searchGroups(
            search.split("%20").join(" ")
        );
        for (let i = 0; i < groups.length; i++) {
            groups[i].imageLink = buildUrl("groups", groups[i].imageLink);
            groups[i].membersCount = await groupModel.getMembersCount(groups[i].id);
        }
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
            } catch (error) {
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
            } catch (error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON" }));
                requestLogger(req.method, req.url, 400);
                return;
            }
            const oldGroup = await groupModel.getGroupById(id[0]);
            if (oldGroup.length === 0) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Group not found" }));
                requestLogger(req.method, req.url, 404);
                return;
            }
            if (group.imageLink) {
                if (oldGroup[0].imageLink) {
                    await deleteImage("groups", oldGroup[0].imageLink);
                }
                group.imageLink = await uploadImage(group.imageLink, "groups");
            } else {
                group.imageLink = oldGroup[0].imageLink;
            }
            await groupModel.updateGroup(id[0], group);
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
    if (req.userRole !== "Admin") {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Access denied" }));
        requestLogger(req.method, req.url, 403);
        return;
    }
    try {
        const group = await groupModel.getGroupById(id[0]);
        if (group.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Group not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        if (group[0].imageLink) {
            await deleteImage("groups", group[0].imageLink);
        }
        await groupModel.deleteGroup(id[0]);
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
        const userId = req.userId;
        const userGroups = await groupModel.isUserInGroup(userId, id[0]);
        if (userGroups.length > 0) {
            res.writeHead(409, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "User already in group" }));
            requestLogger(req.method, req.url, 409);
            return;
        }
        const group = await groupModel.getGroupById(id[0]);
        if (group.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Group not found" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        await groupModel.joinGroup(userId, id[0]);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User joined group" }));
        requestLogger(req.method, req.url, 201);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const leaveGroup = async (req, res, id) => {
    try {
        const userId = req.userId;
        const userGroups = await groupModel.isUserInGroup(userId, id[0]);
        if (userGroups.length === 0) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "User not in group" }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        await groupModel.leaveGroup(userId, id[0]);
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

export const getGroupMembers = async (req, res, id) => {
    try {
        const members = await groupModel.getGroupMembers(id[0]);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(members));
        requestLogger(req.method, req.url, 200);
    } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        requestLogger(req.method, req.url, 500);
    }
};

export const getGroupsByUser = async (req, res) => {
    try {
        const userId = req.userId;
        const groups = await groupModel.getGroupsByUser(userId);
        groups.forEach(async (group) => {
            group.imageLink = buildUrl("groups", group.imageLink);
            group.memberCount = await groupModel.getMembersCount(group.id);
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
