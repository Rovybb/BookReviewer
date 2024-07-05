import { getBookById } from "../../models/bookModel.js";
import requestLogger from "../../utils/requestLogger.js";

const handleShowRating = (rating) => {
    let result = "";
    let int = Math.trunc(rating);
    let decimal = rating - int;
    for (let i = 1; i <= int; i++) {
        result += `    --star${i}: 100%;\n`;
    }
    if (decimal === 0) {
        for (let i = int + 1; i <= 5; i++) {
            result += `    --star${i}: 0%;\n`;
        }
        return result;
    }
    result += `    --star${int + 1}: ${decimal * 100}%;\n`;
    for (let i = int + 2; i <= 5; i++) {
        result += `    --star${i}: 0%;\n`;
    }
    return result;
};

const ratingStarsCssGenerator = async (req, res) => {
    const id = req.url.split("/")[2];
    try {
        const queryResponse = await getBookById(id);
        if (!queryResponse.length) {
            res.writeHead(404);
            res.end();
            requestLogger(req.method, req.url, 404);
            return;
        }
        const book = queryResponse[0];
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(`:root {
${handleShowRating(book.rating)}
}`);
        requestLogger(req.method, req.url, 200);
    } catch (error) {
        console.error(error);
        res.writeHead(500);
        res.end();
        requestLogger(req.method, req.url, 500);
    }
};

export default ratingStarsCssGenerator;
