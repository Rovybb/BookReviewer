const sql = require('mssql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataStorage = require('../utils/dataStorage');
const config = require('../utils/config');
const userModel = require('../models/userModel');

async function getUsers(req, res) {
    try {
        const users = await dataStorage.queryDatabase('SELECT * FROM Users');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function getUser(req, res, id) {
    try {
        const user = await dataStorage.queryDatabase('SELECT * FROM Users WHERE id = @id', [{ name: 'id', type: sql.Int, value: id }]);
        if (user.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user[0]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function register(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { email, password } = JSON.parse(body);
            const hashedPassword = await bcrypt.hash(password, 10);
            await dataStorage.queryDatabase('INSERT INTO Users ( password, role, email) VALUES (@password, "User", @email,)', [
                { name: 'email', type: sql.NVarChar, value: email },
                { name: 'password', type: sql.NVarChar, value: hashedPassword },
                { name: 'role', type: sql.NVarChar, value: role }
            ]);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User registered' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}



async function login(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { email, password } = JSON.parse(body);

            const validPassword = await bcrypt.compare(password, user[0].password);
            if (validPassword) {
                const token = jwt.sign({ id: user[0].id, role: user[0].role }, config.jwtSecret, { expiresIn: '1h' });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ token }));
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid credentials' }));
            }
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function updateUser(req, res, id) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { username, password, role, profilePicture, email } = JSON.parse(body);
            const hashedPassword = await bcrypt.hash(password, 10);
            await dataStorage.queryDatabase('UPDATE Users SET username = @username, password = @password, email = @email, role = @role, profilePicture = @profilePicture WHERE id = @id', [
                { name: 'username', type: sql.NVarChar, value: username },
                { name: 'password', type: sql.NVarChar, value: hashedPassword },
                { name: 'role', type: sql.NVarChar, value: role },
                { name: 'profilePicture', type: sql.NVarChar, value: profilePicture },
                { name: 'email', type: sql.NVarChar, value: email },
                { name: 'id', type: sql.Int, value: id }
            ]);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User updated' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function deleteUser(req, res, id) {
    try {
        await dataStorage.queryDatabase('DELETE FROM Users WHERE id = @id', [{ name: 'id', type: sql.Int, value: id }]);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function addBookToLectureList(req, res, userId) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { bookId } = JSON.parse(body);
            await userModel.addBookToLectureList(userId, bookId);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Book added to user\'s lecture list' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function deleteFromLectureList(req, res, userId) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { bookId } = JSON.parse(body);
            await userModel.addBookToLectureList(userId, bookId);
            await userModel.deleteFromLectureList(userId, bookId);
            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

module.exports = {
    getUsers,
    getUser,
    register,
    login,
    updateUser,
    deleteUser,
    addBookToLectureList,
    deleteFromLectureList
};
