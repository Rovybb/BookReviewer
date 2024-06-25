const { generateAndExportStatistics } = require('../services/statisticsService');


function handleStatisticsRoutes(req, res) {
    if (req.url === '/api/statistics/generate' && req.method === 'GET') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { filePath } = JSON.parse(body);
            try {
                await generateAndExportStatistics(filePath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Statistics generated and exported successfully' }));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: err.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Statistics Route Not Found' }));
    }
}

module.exports = { handleStatisticsRoutes };
