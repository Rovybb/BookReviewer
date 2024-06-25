import { queryDatabase } from '../data/dbConnection.js';
import sql from 'mssql';

async function getUsers() {
    const query = 'SELECT * FROM Users';
    return await queryDatabase(query);
}

async function getUserById(id) {
    const query = 'SELECT * FROM Users WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    const result = await queryDatabase(query, params);
    return result[0];
}

async function addUser(user) {
    const query = `
        INSERT INTO Users (username,email, password, role, profilePicture)
        VALUES (@username, @email, @password, @role, @profilePicture);
        SELECT SCOPE_IDENTITY() AS id;
    `;
    const params = [
        { name: 'username', type: sql.NVarChar, value: user.username },
        { name: 'email', type: sql.NVarChar, value: user.email },
        { name: 'password', type: sql.NVarChar, value: user.password },
        { name: 'role', type: sql.NVarChar, value: user.role },
        { name: 'profilePicture', type: sql.NVarChar, value: user.profilePicture }
    ];
    const result = await queryDatabase(query, params);
    return { ...user, id: result[0].id };
}

async function updateUser(id, updatedUser) {
    const query = `
        UPDATE Users
        SET username = @username, email = @email,  password = @password, role = @role, profilePicture = @profilePicture
        WHERE id = @id
    `;
    const params = [
        { name: 'username', type: sql.NVarChar, value: updatedUser.username },
        { name: 'email', type: sql.NVarChar, value: updatedUser.email },
        { name: 'password', type: sql.NVarChar, value: updatedUser.password },
        { name: 'role', type: sql.NVarChar, value: updatedUser.role },
        { name: 'profilePicture', type: sql.NVarChar, value: updatedUser.profilePicture },
        { name: 'id', type: sql.Int, value: id }
    ];
    await queryDatabase(query, params);
    return { id, ...updatedUser };
}

async function deleteUser(id) {
    const query = 'DELETE FROM Users WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    await queryDatabase(query, params);
    return true;
}

async function getListOfLecture(userId) {
    const query = `
        SELECT Books.*
        FROM UsersBooks
        JOIN Books ON UsersBooks.bookId = Books.id
        WHERE UsersBooks.userId = @userId
    `;
    const params = [{ name: 'userId', type: sql.Int, value: userId }];
    return await queryDatabase(query, params);
}

async function addBookToLectureList(userId, bookId) {
    const query = `
        INSERT INTO UsersBooks (userId, bookId)
        VALUES (@userId, @bookId)
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'bookId', type: sql.Int, value: bookId }
    ];
    await queryDatabase(query, params);
}

async function deleteFromLectureList(userId, bookId) {
    const query = `
        DELETE FROM UsersBooks
        WHERE userId = @userId AND bookId = @bookId
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'bookId', type: sql.Int, value: bookId }
    ];
    await queryDatabase(query, params);
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    getListOfLecture,
    addBookToLectureList,
    deleteFromLectureList
};
