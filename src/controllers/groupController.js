const groupModel = require('../models/groupModel');

async function getGroups(req, res) {
    try {
        const groups = await groupModel.getGroups();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(groups));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function getGroup(req, res, id) {
    try {
        const group = await groupModel.getGroupById(id);
        if (group.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(group[0]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Group not found' }));
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function createGroup(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const group = JSON.parse(body);
            await groupModel.createGroup(group);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Group created' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function updateGroup(req, res, id) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const group = JSON.parse(body);
            await groupModel.updateGroup(id, group);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Group updated' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function deleteGroup(req, res, id) {
    try {
        await groupModel.deleteGroup(id);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function joinGroup(userId, groupId) {
    const query = `
        INSERT INTO UsersGroups (userId, groupId)
        VALUES (@userId, @groupId)
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'groupId', type: sql.Int, value: groupId }
    ];
    await queryDatabase(query, params);
}


module.exports = {
    getGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup
};
