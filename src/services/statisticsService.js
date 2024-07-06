import { queryDatabase } from "../data/dbConnection.js";

const getReadingStatistics = async () => {
    const mostReadGenresQuery = `
        SELECT genre, COUNT(*) AS count
        FROM Books
        JOIN UsersBooks ON Books.id = UsersBooks.bookId
        GROUP BY genre
        ORDER BY count DESC
    `;

    const mostReadAuthorsQuery = `
        SELECT author, COUNT(*) AS count
        FROM Books
        JOIN UsersBooks ON Books.id = UsersBooks.bookId
        GROUP BY author
        ORDER BY count DESC
    `;

    const top5MostReadBooksQuery = `
        SELECT TOP 5 Books.title, COUNT(*) AS count
        FROM Books
        JOIN UsersBooks ON Books.id = UsersBooks.bookId
        GROUP BY Books.title
        ORDER BY count DESC
    `;

    const [mostReadGenres, mostReadAuthors, top5MostReadBooks] = await Promise.all([
        queryDatabase(mostReadGenresQuery),
        queryDatabase(mostReadAuthorsQuery),
        queryDatabase(top5MostReadBooksQuery)
    ]);

    return {
        mostReadGenres,
        mostReadAuthors,
        top5MostReadBooks
    };
};

export default getReadingStatistics;