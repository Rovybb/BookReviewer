import {
    getGroupMessages,
    getGroupMessage,
    createGroupMessage,
    updateGroupMessage,
    deleteGroupMessage,
} from "../../controllers/groupMessageController.js";
import requestLogger from "../../utils/requestLogger.js";

const handleGroupMessageRoutes = (req, res) => {
    if (
        req.url.match(/\/api\/groupMessages\/group\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const groupId = req.url.split("/")[4];
        getGroupMessages(req, res, groupId);
    } else if (
        req.url.match(/\/api\/groupMessages\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = req.url.split("/")[3];
        getGroupMessage(req, res, id);
    } else if (req.url === "/api/groupMessages" && req.method === "POST") {
        createGroupMessage(req, res);
    } else if (
        req.url.match(/\/api\/groupMessages\/([0-9]+)/) &&
        req.method === "PUT"
    ) {
        const id = req.url.split("/")[3];
        updateGroupMessage(req, res, id);
    } else if (
        req.url.match(/\/api\/groupMessages\/([0-9]+)/) &&
        req.method === "DELETE"
    ) {
        const id = req.url.split("/")[3];
        deleteGroupMessage(req, res, id);
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "GroupMessage Route Not Found" }));
        requestLogger(req.method, req.url, 404);
    }
};

export default handleGroupMessageRoutes;
