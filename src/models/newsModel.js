import sql from "mssql";
import { queryDatabase } from "../data/dbConnection.js";

export const getNews = async () => {
    const query = 'SELECT * FROM News ORDER BY date ASC';
    return await queryDatabase(query);
}

export const getNewsById = async (id) => {
    const query = 'SELECT * FROM News WHERE id = @id';
    return await queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
}

export const addNews = async (news) => {
    const query = `
        INSERT INTO News (title, content, date, link) 
        VALUES (@title, @content, @date, @link)
    `;
    const params = [
        { name: 'title', type: sql.NVarChar, value: news.title },
        { name: 'content', type: sql.NVarChar, value: news.content },
        { name: 'date', type: sql.DateTime, value: new Date() },
        { name: 'link', type: sql.NVarChar, value: news.link }
    ];
    await queryDatabase(query, params);
}

export const updateNews = async (id, news) => {
    const query = `
        UPDATE News 
        SET title = @title, content = @content, link = @link
        WHERE id = @id
    `;
    const params = [
        { name: 'title', type: sql.NVarChar, value: news.title },
        { name: 'content', type: sql.NVarChar, value: news.content },
        { name: 'link', type: sql.NVarChar, value: news.link },
        { name: 'id', type: sql.Int, value: id }
    ];
    await queryDatabase(query, params);
}

export const deleteNews = async (id) => {
    const query = 'DELETE FROM News WHERE id = @id';
    await queryDatabase(query, [{ name: 'id', type: sql.Int, value: id }]);
}

