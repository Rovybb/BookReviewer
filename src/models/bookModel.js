import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";

export const searchBooks = async (search, genre) => {
    const query = `
            SELECT 
                b.id, 
                b.title, 
                b.author, 
                b.genre, 
                b.imageLink, 
                b.rating,
                b.description,
                COUNT(ub.bookId) AS popularity
            FROM Books b
            LEFT JOIN UsersBooks ub ON b.id = ub.bookId
            WHERE ( b.title LIKE @search OR b.author LIKE @search ) ${
                genre ? "AND b.genre = @genre" : ""
            }
            GROUP BY 
                b.id, 
                b.title, 
                b.author, 
                b.genre, 
                b.imageLink, 
                b.rating,
                b.description
            ORDER BY popularity DESC;
        `;
    const params = [
        { name: "search", type: sql.NVarChar, value: `%${search}%` },
        { name: "genre", type: sql.NVarChar, value: genre },
    ];
    const response = await queryDatabase(query, params);
    return response.map((book) => {
        const { popularity, ...rest } = book;
        return rest;
    });
};

export const getBookById = async (id) => {
    const query = "SELECT * FROM Books WHERE id = @id";
    const params = [{ name: "id", type: sql.Int, value: id }];
    return await queryDatabase(query, params);
};

export const addBook = async (book) => {
    const query = `
        INSERT INTO Books (title, author, genre, imageLink, rating, description)
        VALUES (@title, @author, @genre, @imageLink, @rating, @description);
        SELECT SCOPE_IDENTITY() AS id;
    `;
    const params = [
        { name: "title", type: sql.NVarChar, value: book.title },
        { name: "author", type: sql.NVarChar, value: book.author },
        { name: "genre", type: sql.NVarChar, value: book.genre },
        { name: "imageLink", type: sql.NVarChar, value: book.imageLink },
        { name: "rating", type: sql.Float, value: book.rating },
        { name: "description", type: sql.NVarChar, value: book.description },
    ];
    await queryDatabase(query, params);
};

export const updateBook = async (id, updatedBook) => {
    const query = `
        UPDATE Books
        SET title = @title, author = @author, genre = @genre,
            imageLink = @imageLink, rating = @rating, description = @description
        WHERE id = @id
    `;
    const params = [
        { name: "title", type: sql.NVarChar, value: updatedBook.title },
        { name: "author", type: sql.NVarChar, value: updatedBook.author },
        { name: "genre", type: sql.NVarChar, value: updatedBook.genre },
        { name: "imageLink", type: sql.NVarChar, value: updatedBook.imageLink },
        { name: "rating", type: sql.Float, value: updatedBook.rating },
        { name: "description", type: sql.NVarChar, value: updatedBook.description },
        { name: "id", type: sql.Int, value: id },
    ];
    await queryDatabase(query, params);
};

export const deleteBook = async (id) => {
    const query = "DELETE FROM Books WHERE id = @id";
    const params = [{ name: "id", type: sql.Int, value: id }];
    await queryDatabase(query, params);
};
