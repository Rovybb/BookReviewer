const dataStorage = require('../utils/dataStorage');
const sql = require('mssql');

async function getGroups() {
    const query = 'SELECT * FROM Groups';
    return await dataStorage.queryDatabase(query);
}

async function getGroupById(id) {
    const query = 'SELECT * FROM Groups WHERE id = @id';
    return await dataStorage.queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
}

async function createGroup(group) {
    const query = `
        INSERT INTO Groups (name, description, imageLink) 
        VALUES (@name, @description, @imageLink)
    `;
    const params = [
        { name: 'name', type: sql.NVarChar, value: group.name },
        { name: 'description', type: sql.NVarChar, value: group.description },
        { name: 'imageLink', type: sql.NVarChar, value: group.imageLink },
    ];
    return await dataStorage.queryDatabase(query, params);
}

async function updateGroup(id, group) {
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
    return await dataStorage.queryDatabase(query, params);
}

async function deleteGroup(id) {
    const query = 'DELETE FROM Groups WHERE id = @id';
    return await dataStorage.queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
}

module.exports = {
    getGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup
};
