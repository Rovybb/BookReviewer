const dataStorage = require('../utils/dataStorage');
const sql = require('mssql');

async function getReviews(req, res) {
    try {
        const reviews = await dataStorage.queryDatabase('SELECT * FROM Reviews');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reviews));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function getReview(req, res, id) {
    try {
        const review = await dataStorage.queryDatabase('SELECT * FROM Reviews WHERE id = @id', [{ name: 'id', type: sql.Int, value: id }]);
        if (review.length > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(review[0]));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Review not found' }));
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function addReview(req, res) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { rating, description, bookId } = JSON.parse(body);
            const query = `
                INSERT INTO Reviews (rating, description, bookId, userId, createdAt)
                VALUES (@rating, @description, @bookId, @userId, @createdAt);
                SELECT SCOPE_IDENTITY() AS id;
            `;
            const params = [
                { name: 'rating', type: sql.Int, value: rating },
                { name: 'description', type: sql.NVarChar, value: description },
                { name: 'bookId', type: sql.Int, value: bookId },
                { name: 'userId', type: sql.Int, value: req.user.id },
                { name: 'createdAt', type: sql.DateTime, value: new Date() }
            ];
            const result = await dataStorage.queryDatabase(query, params);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Review added', id: result[0].id }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function updateReview(req, res, id) {
    try {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const { rating, description, bookId } = JSON.parse(body);
            const query = `
                UPDATE Reviews
                SET rating = @rating, description = @description, bookId = @bookId, userId = @userId
                WHERE id = @id
            `;
            const params = [
                { name: 'rating', type: sql.Int, value: rating },
                { name: 'description', type: sql.NVarChar, value: description },
                { name: 'bookId', type: sql.Int, value: bookId },
                { name: 'userId', type: sql.Int, value: req.user.id },
                { name: 'id', type: sql.Int, value: id }
            ];
            await dataStorage.queryDatabase(query, params);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Review updated' }));
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

async function deleteReview(req, res, id) {
    try {
        await dataStorage.queryDatabase('DELETE FROM Reviews WHERE id = @id', [{ name: 'id', type: sql.Int, value: id }]);
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: err.message }));
    }
}

module.exports = {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
};
