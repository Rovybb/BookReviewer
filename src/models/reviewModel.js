const { queryDatabase } = require('../utils/dataStorage');
const sql = require('mssql');

async function getReviews() {
    const query = 'SELECT * FROM Reviews';
    return await queryDatabase(query);
}

async function getReviewById(id) {
    const query = 'SELECT * FROM Reviews WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    const result = await queryDatabase(query, params);
    return result[0];
}

async function addReview(review) {
    const query = `
        INSERT INTO Reviews (rating, description, bookId, userId, createdAt)
        VALUES (@rating, @description, @bookId, @userId, @createdAt);
        SELECT SCOPE_IDENTITY() AS id;
    `;
    const params = [
        { name: 'rating', type: sql.Int, value: review.rating },
        { name: 'description', type: sql.NVarChar, value: review.description },
        { name: 'bookId', type: sql.Int, value: review.bookId },
        { name: 'userId', type: sql.Int, value: review.userId },
        { name: 'createdAt', type: sql.DateTime, value: new Date() }
    ];
    const result = await queryDatabase(query, params);
    return { ...review, id: result[0].id };
}

async function updateReview(id, updatedReview) {
    const query = `
        UPDATE Reviews
        SET rating = @rating, description = @description, bookId = @bookId, userId = @userId
        WHERE id = @id
    `;
    const params = [
        { name: 'rating', type: sql.Int, value: updatedReview.rating },
        { name: 'description', type: sql.NVarChar, value: updatedReview.description },
        { name: 'bookId', type: sql.Int, value: updatedReview.bookId },
        { name: 'id', type: sql.Int, value: id },
        { name: 'userId', type: sql.Int, value: updatedReview.userId }
    ];
    await queryDatabase(query, params);
    return { id, ...updatedReview };
}

async function deleteReview(id) {
    const query = 'DELETE FROM Reviews WHERE id = @id';
    const params = [{ name: 'id', type: sql.Int, value: id }];
    await queryDatabase(query, params);
    return true;
}

module.exports = {
    getReviews,
    getReviewById,
    addReview,
    updateReview,
    deleteReview
};
