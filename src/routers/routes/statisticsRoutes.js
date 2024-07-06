import getReadingStatistics from "../../services/statisticsService.js";
import { Parser } from "json2csv";
import requestLogger from "../../utils/requestLogger.js";

const downloadStatistics = async (req, res) => {
    const statistics = await getReadingStatistics();
    const parser = new Parser();
    const csvString = parser.parse(statistics);
    res.writeHead(200, {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=statistics.csv",
    });
    res.end(csvString);
    requestLogger(req.method, req.url, 200);
};

export default downloadStatistics;
