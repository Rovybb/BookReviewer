import { getGroupById, getMembersCount } from "../../models/groupModel.js";
import errorPageTemplate from "./templates/errorPageTemplate.js";
import requestLogger from "../../utils/requestLogger.js";
import groupPageTemplate from "./templates/groupPageTemplate.js";
import { buildUrl } from "../../services/imageUploadService.js";
import { sendData } from "../pageRouter.js";

const groupPageGenerator = async (req, res) => {
    const id = req.url.split("/")[2];
    try {
        const queryResponse = await getGroupById(id);
        if (!queryResponse.length) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(errorPageTemplate({
                title: "Not Found",
                message: "The group you are looking for does not exist.<br><a href='/'>Return to home page</a>"
            }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        queryResponse[0].membersCount = await getMembersCount(id);
        queryResponse[0].imageLink = buildUrl("groups", queryResponse[0].imageLink);
        const group = queryResponse[0];
        const page = groupPageTemplate(group);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(page);
        requestLogger(req.method, req.url, 200);
    }
    catch (error) {
        console.error(error);
        sendData(req, res);
    }
};

export default groupPageGenerator;
