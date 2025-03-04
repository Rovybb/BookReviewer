import handleBookRoutes from './routes/bookRoutes.js';
import handleReviewRoutes from './routes/reviewRoutes.js';
import handleUserRoutes from './routes/userRoutes.js';
import handleGroupRoutes from './routes/groupRoutes.js';
import handleGroupMessageRoutes from './routes/groupMessageRoutes.js';
import handleNewsRoutes from './routes/newsRoutes.js';
import downloadStatistics from './routes/statisticsRoutes.js';
import { rssService } from '../services/rssService.js';

const handleAPIRoutes = async (req, res) => {
    if (req.url === '/rss.xml') {
        rssService(req, res);
    } else if (req.url.startsWith('/api/books')) {
        handleBookRoutes(req, res);
    } else if (req.url.startsWith('/api/reviews')) {
        handleReviewRoutes(req, res);
    } else if (req.url.startsWith('/api/users')) {
        handleUserRoutes(req, res);
    } else if (req.url.startsWith('/api/groups')) {
        handleGroupRoutes(req, res);
    } else if (req.url.startsWith('/api/groupMessages')) {
        handleGroupMessageRoutes(req, res);
    }
    else if (req.url.startsWith('/api/statistics/download')) {
        downloadStatistics(req, res);
    }
    else if (req.url.startsWith('/api/news')) {
        handleNewsRoutes(req, res);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route Not Found' }));
    }
};

export default handleAPIRoutes;