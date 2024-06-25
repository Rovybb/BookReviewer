import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";

export const getBooks = async () => {
    const query = "SELECT * FROM Books";
    return await queryDatabase(query);
};

export const getBookById = async (id) => {
    const query = "SELECT * FROM Books WHERE id = @id";
    const params = [{ name: "id", type: sql.Int, value: id }];
    const result = await queryDatabase(query, params);
    return result[0];
};

export const addBook = async (book) => {
    const query = `
        INSERT INTO Books (title, author, genre, imageLink, rating)
        VALUES (@title, @author, @genre, @imageLink, @rating);
        SELECT SCOPE_IDENTITY() AS id;
    `;
    const params = [
        { name: "title", type: sql.NVarChar, value: book.title },
        { name: "author", type: sql.NVarChar, value: book.author },
        { name: "genre", type: sql.NVarChar, value: book.genre },
        { name: "imageLink", type: sql.NVarChar, value: book.imageLink },
        { name: "rating", type: sql.Float, value: book.rating },
    ];
    const result = await queryDatabase(query, params);
    return { ...book, id: result[0].id };
};

export const updateBook = async (id, updatedBook) => {
    const query = `
        UPDATE Books
        SET title = @title, author = @author, genre = @genre,
            imageLink = @imageLink, rating = @rating
        WHERE id = @id
    `;
    const params = [
        { name: "title", type: sql.NVarChar, value: updatedBook.title },
        { name: "author", type: sql.NVarChar, value: updatedBook.author },
        { name: "genre", type: sql.NVarChar, value: updatedBook.genre },
        { name: "imageLink", type: sql.NVarChar, value: updatedBook.imageLink },
        { name: "rating", type: sql.Float, value: updatedBook.rating },
        { name: "id", type: sql.Int, value: id },
    ];
    await queryDatabase(query, params);
    return { id, ...updatedBook };
};

export const deleteBook = async (id) => {
    const query = "DELETE FROM Books WHERE id = @id";
    const params = [{ name: "id", type: sql.Int, value: id }];
    await queryDatabase(query, params);
    return true;
};
