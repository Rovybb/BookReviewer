import { queryDatabase } from "../data/dbConnection.js";
import { createObjectCsvWriter } from "csv-writer";

export const getReadingStatistics = async () => {
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

export const exportStatisticsToCSV = async (statistics, filePath) => {
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'metric', title: 'Metric' },
            { id: 'value', title: 'Value' }
        ]
    });

    const records = [
        { metric: 'Most Read Genres', value: JSON.stringify(statistics.mostReadGenres) },
        { metric: 'Most Read Authors', value: JSON.stringify(statistics.mostReadAuthors) },
        { metric: 'Top Five Most Read Books', value: JSON.stringify(statistics.top5MostReadBooks) },
    ];

    await csvWriter.writeRecords(records);
    console.log('Statistics exported to CSV successfully.');
};

export const generateAndExportStatistics = async (filePath) => {
    const statistics = await getReadingStatistics();
    await exportStatisticsToCSV(statistics, filePath);
};

