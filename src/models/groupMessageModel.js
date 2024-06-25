const { queryDatabase } = require('../utils/dataStorage');
const sql = require('mssql');

async function getGroupMessages(groupId) {
    const query = 'SELECT * FROM GroupMessages WHERE groupId = @groupId';
    const params = [{ name: 'groupId', type: sql.Int, value: groupId }];
    return await queryDatabase(query, params);
}

async function getGroupMessageById(id) {
    const query = 'SELECT * FROM GroupMessages WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    return await queryDatabase(query, params);
}

async function createGroupMessage(groupMessage) {
    const query = `
        INSERT INTO GroupMessages (groupId, userId, message, createdAt)
        VALUES (@groupId, @userId, @message, @createdAt);
        SELECT SCOPE_IDENTITY() AS id;
    `;
    const params = [
        { name: 'groupId', type: sql.Int, value: groupMessage.groupId },
        { name: 'userId', type: sql.Int, value: groupMessage.userId },
        { name: 'message', type: sql.NVarChar, value: groupMessage.message },
        { name: 'createdAt', type: sql.DateTime, value: new Date() }
    ];
    const result = await queryDatabase(query, params);
    return { ...groupMessage, id: result[0].id };
}

async function updateGroupMessage(id, groupMessage) {
    const query = `
        UPDATE GroupMessages
        SET message = @message
        WHERE id = @id
    `;
    const params = [
        { name: 'message', type: sql.NVarChar, value: groupMessage.message },
        { name: 'id', type: sql.Int, value: id }
    ];
    await queryDatabase(query, params);
    return { id, ...groupMessage };
}

async function deleteGroupMessage(id) {
    const query = 'DELETE FROM GroupMessages WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    await queryDatabase(query, params);
    return true;
}

async function isUserInGroup(userId, groupId) {
    const query = `
        SELECT 1 FROM UsersGroups
        WHERE userId = @userId AND groupId = @groupId
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'groupId', type: sql.Int, value: groupId }
    ];
    const result = await queryDatabase(query, params);
    return result.length > 0;
}

module.exports = {
    getGroupMessages,
    getGroupMessageById,
    createGroupMessage,
    updateGroupMessage,
    deleteGroupMessage,
    isUserInGroup
};
