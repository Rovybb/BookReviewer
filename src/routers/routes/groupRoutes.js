const { getGroups, getGroup, createGroup, updateGroup, deleteGroup } = require('../controllers/groupController');

function handleGroupRoutes(req, res) {
    if (req.url === '/api/groups' && req.method === 'GET') {
        getGroups(req, res);
    } else if (req.url.match(/\/api\/groups\/([0-9]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[3];
        getGroup(req, res, id);
    } else if (req.url === '/api/groups' && req.method === 'POST') {
        createGroup(req, res);
    } else if (req.url.match(/\/api\/groups\/([0-9]+)/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        updateGroup(req, res, id);
    } else if (req.url.match(/\/api\/groups\/([0-9]+)/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        deleteGroup(req, res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Group Route Not Found' }));
    }
}

module.exports = { handleGroupRoutes };
