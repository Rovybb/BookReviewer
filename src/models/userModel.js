import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";

export const getUsers = async () => {
    const query = 'SELECT * FROM Users';
    return await queryDatabase(query);
};

export const getUserById = async (id) => {
    const query = 'SELECT * FROM Users WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    return await queryDatabase(query, params);
};

export const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM Users WHERE email = @email';
    const params = [{ name: 'email', type: sql.NVarChar, value: email }];
    return await queryDatabase(query, params);
};

export const addUser = async (user) => {
    const query = `
        INSERT INTO Users (username, email, password, role, profilePicture)
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
    await queryDatabase(query, params);
};

export const updateUser = async (id, updatedUser) => {
    const query = `
        UPDATE Users
        SET username = @username, email = @email,  password = @password, profilePicture = @profilePicture
        WHERE id = @id
    `;
    const params = [
        { name: 'username', type: sql.NVarChar, value: updatedUser.username },
        { name: 'email', type: sql.NVarChar, value: updatedUser.email },
        { name: 'password', type: sql.NVarChar, value: updatedUser.password },
        { name: 'profilePicture', type: sql.NVarChar, value: updatedUser.profilePicture },
        { name: 'id', type: sql.Int, value: id }
    ];
    await queryDatabase(query, params);
};

export const deleteUser = async (id) => {
    const query = 'DELETE FROM Users WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    await queryDatabase(query, params);
};

export const getListOfLecture = async (userId) => {
    const query = `
        SELECT Books.*
        FROM UsersBooks
        JOIN Books ON UsersBooks.bookId = Books.id
        WHERE UsersBooks.userId = @userId
    `;
    const params = [{ name: 'userId', type: sql.Int, value: userId }];
    return await queryDatabase(query, params);
};

export const addBookToLectureList = async (userId, bookId) => {
    const query = `
        INSERT INTO UsersBooks (userId, bookId)
        VALUES (@userId, @bookId)
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'bookId', type: sql.Int, value: bookId }
    ];
    await queryDatabase(query, params);
};

export const deleteFromLectureList = async (userId, bookId) => {
    const query = `
        DELETE FROM UsersBooks
        WHERE userId = @userId AND bookId = @bookId
    `;
    const params = [
        { name: 'userId', type: sql.Int, value: userId },
        { name: 'bookId', type: sql.Int, value: bookId }
    ];
    await queryDatabase(query, params);
};
