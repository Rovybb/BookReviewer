import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";

export const getGroupMessages = async (groupId) => {
    const query = 'SELECT * FROM GroupMessages WHERE groupId = @groupId';
    const params = [{ name: 'groupId', type: sql.Int, value: groupId }];
    return await queryDatabase(query, params);
};

export const getGroupMessageById = async (id) => {
    const query = 'SELECT * FROM GroupMessages WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    return await queryDatabase(query, params);
};

export const createGroupMessage = async (groupMessage) => {
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
    await queryDatabase(query, params);
};

export const updateGroupMessage = async (id, groupMessage) => {
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
};

export const deleteGroupMessage = async (id) => {
    const query = 'DELETE FROM GroupMessages WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    await queryDatabase(query, params);
};

export const isUserInGroup = async (userId, groupId) => {
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
};
