import { generateAndExportStatistics } from "../../services/statisticsService.js";
import requestLogger from "../../utils/requestLogger.js";

const handleStatisticsRoutes = (req, res) => {
    if (req.url === "/api/statistics/generate" && req.method === "GET") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", async () => {
            const { filePath } = JSON.parse(body);
            try {
                await generateAndExportStatistics(filePath);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({
                        message:
                            "Statistics generated and exported successfully",
                    })
                );
                requestLogger(req.method, req.url, 200);
            } catch (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: err.message }));
                requestLogger(req.method, req.url, 500);
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Statistics Route Not Found" }));
        requestLogger(req.method, req.url, 404);
    }
};

export default handleStatisticsRoutes;
