const { getUsers, getUser, register, login, updateUser, deleteUser, addBookToLectureList } = require('../controllers/userController');
const { deleteFromLectureList } = require('../models/userModel');

function handleUserRoutes(req, res) {
    if (req.url === '/api/users' && req.method === 'GET') {
        getUsers(req, res);
    } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[3];
        getUser(req, res, id);
    } else if (req.url === '/api/users/register' && req.method === 'POST') {
        register(req, res);
    } else if (req.url === '/api/users/login' && req.method === 'POST') {
        login(req, res);
    } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'PUT') {
        const id = req.url.split('/')[3];
        updateUser(req, res, id);
    } else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === 'DELETE') {
        const id = req.url.split('/')[3];
        deleteUser(req, res, id);
    } else if (req.url.match(/\/api\/users\/booklist\/([0-9]+)/) && req.method === 'POST') {
        const id = req.url.split('/')[4];
        addBookToLectureList(req, res, id);
    } else if (req.url.match(/\/api\/users\/booklist\/([0-9]+)/) && req.method === 'DELETE') {
        const id = req.url.split('/')[4];
        deleteFromLectureList(req, res, id);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User Route Not Found' }));
    }
}

export default handleUserRoutes;
