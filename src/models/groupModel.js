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
    return await queryDatabase(query, params);
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
    return await queryDatabase(query, params);
};

export const deleteGroup = async (id) => {
    const query = 'DELETE FROM Groups WHERE id = @id';
    return await queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
};
