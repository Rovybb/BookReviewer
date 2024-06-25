import handleBookRoutes from './routes/bookRoutes.js';
import handleReviewRoutes from './routes/reviewRoutes.js';
import handleUserRoutes from './routes/userRoutes.js';
import handleStatisticsRoutes from './routes/statisticsRoutes.js';
import handleGroupRoutes from './routes/groupRoutes.js';
import handleGroupMessageRoutes from './routes/groupMessageRoutes.js';
import { getAllNews, createFeed } from '../services/newsService.js';

async function handleAPIRoutes(req, res) {
    if (req.url === '/rss.xml') {
        res.writeHead(200, { "Content-Type": "application/xml" });
        res.write(createFeed(await getAllNews()));
        res.end();
    } else if (req.url.startsWith('/api/books')) {
        handleBookRoutes(req, res);
    } else if (req.url.startsWith('/api/reviews')) {
        handleReviewRoutes(req, res);
    } else if (req.url.startsWith('/api/users')) {
        handleUserRoutes(req, res);
    } else if (req.url.startsWith('/api/statistics')) {
        handleStatisticsRoutes(req, res);
    } else if (req.url.startsWith('/api/groups')) {
        handleGroupRoutes(req, res);
    } else if (req.url.startsWith('/api/groupMessages')) {
        handleGroupMessageRoutes(req, res);
    }
    else if (req.url.startsWith('/api/statistics')) {
        handleStatisticsRoutes(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found' }));
    }
}

export default handleAPIRoutes;