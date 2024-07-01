import * as bookModel from "../../models/bookModel.js";
import bookPageTemplate from "./templates/bookPageTemplate.js";
import { sendData } from "../pageRouter.js";
import requestLogger from "../../utils/requestLogger.js";

const bookPageGenerator = async (req, res) => {
    const id = req.url.split("/")[2];
    try {
        const queryResponse = await bookModel.getBookById(id);
        if (!queryResponse.length) {
            sendData(req, res);
            return;
        }
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
