import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";

export const getGroups = async () => {
    const query = 'SELECT * FROM Groups';
    return await queryDatabase(query);
};

export const getGroupById = async (id) => {
    const query = 'SELECT * FROM Groups WHERE id = @id';
    return await queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
};

export const searchGroups = async (search) => {
    const query = `SELECT * FROM Groups WHERE LOWER(name) LIKE @search OR LOWER(description) LIKE @search`;
    return await queryDatabase(query, [{ name: 'search', type: sql.NVarChar, value: `%${search}%` }]);
};

export const createGroup = async (group) => {
    const query = `
        INSERT INTO Groups (name, description, imageLink) 
        VALUES (@name, @description, @imageLink)
    `;
    const params = [
        { name: 'name', type: sql.NVarChar, value: group.name },
        { name: 'description', type: sql.NVarChar, value: group.description },
        { name: 'imageLink', type: sql.NVarChar, value: group.imageLink },
    ];
    await queryDatabase(query, params);
};

export const updateGroup = async (id, group) => {
    const query = `
        UPDATE Groups 
        SET name = @name, description = @description, imageLink = @imageLink 
        WHERE id = @id
    `;
    const params = [
        { name: 'name', type: sql.NVarChar, value: group.name },
        { name: 'description', type: sql.NVarChar, value: group.description },
        { name: 'imageLink', type: sql.NVarChar, value: group.imageLink },
        { name: 'id', type: sql.Int, value: id }
    ];
    await queryDatabase(query, params);
};

export const deleteGroup = async (id) => {
    const query = 'DELETE FROM Groups WHERE id = @id';
    await queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
};

export const joinGroup = async (userId, groupId) => {
    const query = `
        INSERT INTO UsersGroups (userId, groupId)
        VALUES (@userId, @groupId)
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'groupId', type: sql.Int, value: groupId }
    ];
    await queryDatabase(query, params);
};

export const leaveGroup = async (userId, groupId) => {
    const query = `
        DELETE FROM UsersGroups
        WHERE userId = @userId AND groupId = @groupId
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'groupId', type: sql.Int, value: groupId }
    ];
    await queryDatabase(query, params);
};

export const isUserInGroup = async (userId, groupId) => {
    const query = `
        SELECT * FROM UsersGroups
        WHERE userId = @userId AND groupId = @groupId
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'groupId', type: sql.Int, value: groupId }
    ];
    return await queryDatabase(query, params);
}

export const getGroupMembers = async (groupId) => {
    const query = `
        SELECT Users.id, Users.username, Users.email
        FROM Users
        JOIN UsersGroups ON Users.id = UsersGroups.userId
        WHERE UsersGroups.groupId = @groupId
    `;
    return await queryDatabase(query, [{ name: 'groupId', type: sql.Int, value: groupId }]);
};

export const getGroupsByUserId = async (userId) => {
    const query = `
        SELECT Groups.id, Groups.name, Groups.description, Groups.imageLink
        FROM Groups
        JOIN UsersGroups ON Groups.id = UsersGroups.groupId
        WHERE UsersGroups.userId = @userId
    `;
    return await queryDatabase(query, [{ name: 'userId', type: sql.Int, value: userId }]);
};

export const getMembersCount = async (groupId) => {
    const query = 'SELECT COUNT(*) AS membersCount FROM UsersGroups WHERE groupId = @groupId';
    const result = await queryDatabase(query, [{ name: 'groupId', type: sql.Int, value: groupId }]);
    return result[0].membersCount;
};
