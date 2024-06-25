const groupMessageModel = require('../models/groupMessageModel');

async function getGroupMessages(req, res, groupId) {
    try {
        const groupMessages = await groupMessageModel.getGroupMessages(groupId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(groupMessages));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function getGroupMessage(req, res, id) {
    try {
        const groupMessage = await groupMessageModel.getGroupMessageById(id);
        if (groupMessage.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(groupMessage[0]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'GroupMessage not found' }));
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function createGroupMessage(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const groupMessage = JSON.parse(body);
            const { groupId, userId, message } = groupMessage;

            const isUserInGroup = await groupMessageModel.isUserInGroup(userId, groupId);
            if (!isUserInGroup) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not a member of the group' }));
                return;
            }

            const newGroupMessage = await groupMessageModel.createGroupMessage({ groupId, userId, message });
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newGroupMessage));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function updateGroupMessage(req, res, id) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const groupMessage = JSON.parse(body);
            await groupMessageModel.updateGroupMessage(id, groupMessage);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'GroupMessage updated' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function deleteGroupMessage(req, res, id) {
    try {
        await groupMessageModel.deleteGroupMessage(id);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

module.exports = {
    getGroupMessages,
    getGroupMessage,
    createGroupMessage,
    updateGroupMessage,
    deleteGroupMessage
};
