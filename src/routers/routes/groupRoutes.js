import {
    getGroups,
    getGroup,
    searchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    getGroupMembers,
    getGroupsByUser,
} from "../../controllers/groupController.js";
import requestLogger from "../../utils/requestLogger.js";
import verifyToken from "../../services/authService.js";

const handleGroupRoutes = (req, res) => {
    if (req.url.startsWith("/api/groups/search/") && req.method === "GET") {
        const search = req.url.split("/")[4];
        searchGroups(req, res, search);
    } else if (req.url === "/api/groups" && req.method === "GET") {
        getGroups(req, res);
    } else if (
        req.url.match(/\/api\/groups\/([0-9]+)\/members/) &&
        req.method === "GET"
    ) {
        const id = req.url.split("/")[3];
        verifyToken(req, res, getGroupMembers, id);
    } else if (req.url === "/api/groups" && req.method === "POST") {
        verifyToken(req, res, createGroup);
    } else if (
        req.url.match(/\/api\/groups\/([0-9]+)/) &&
        req.method === "PUT"
    ) {
        const id = req.url.split("/")[3];
        verifyToken(req, res, updateGroup, id);
    } else if (
        req.url.match(/\/api\/groups\/([0-9]+)/) &&
        req.method === "DELETE"
    ) {
        const id = req.url.split("/")[3];
        verifyToken(req, res, deleteGroup, id);
    } else if (
        req.url.match(/\/api\/groups\/join\/([0-9]+)/) &&
        req.method === "POST"
    ) {
        const id = req.url.split("/")[4];
        verifyToken(req, res, joinGroup, id);
    } else if (
        req.url.match(/\/api\/groups\/leave\/([0-9]+)/) &&
        req.method === "POST"
    ) {
        const id = req.url.split("/")[4];
        verifyToken(req, res, leaveGroup, id);
    } else if (
        req.url.match(/\/api\/groups\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = req.url.split("/")[3];
        getGroup(req, res, id);
    } else if (req.url.match(/\/api\/groups\/user/) && req.method === "GET") {
        verifyToken(req, res, getGroupsByUser);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Group Route Not Found" }));
        requestLogger(req.method, req.url, 404);
    }
};

export default handleGroupRoutes;
