import { getBookById } from "../../models/bookModel.js";
import bookPageTemplate from "./templates/bookPageTemplate.js";
import { sendData } from "../pageRouter.js";
import requestLogger from "../../utils/requestLogger.js";
import errorPageTemplate from "./templates/errorPageTemplate.js";
import { buildUrl } from "../../services/imageUploadService.js";

const bookPageGenerator = async (req, res) => {
    const id = req.url.split("/")[2];
    console.log(id);
    try {
        const queryResponse = await getBookById(id);
        if (!queryResponse.length) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(errorPageTemplate({
                title: "Not Found",
                message: "The book you are looking for does not exist.<br><a href='/'>Return to home page</a>"
            }));
            requestLogger(req.method, req.url, 404);
            return;
        }
        queryResponse[0].imageLink = buildUrl("books", queryResponse[0].imageLink);
        const book = queryResponse[0];
        const page = bookPageTemplate(book);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(page);
        requestLogger(req.method, req.url, 200);
    }
    catch (error) {
        console.error(error);
        sendData(req, res);
    }
};

export default bookPageGenerator;
