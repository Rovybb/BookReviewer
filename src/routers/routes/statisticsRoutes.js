import getReadingStatistics from "../../services/statisticsService.js";
import { Parser } from "json2csv";
import requestLogger from "../../utils/requestLogger.js";

const downloadStatistics = async (req, res) => {
    const { mostReadGenres, mostReadAuthors, top5MostReadBooks } =
        await getReadingStatistics();

    const mostReadGenresFields = ["genre", "count"];
    const mostReadAuthorsFields = ["author", "count"];
    const top5MostReadBooksFields = ["title", "count"];

    const mostReadGenresParser = new Parser({
        fields: mostReadGenresFields,
    });
    const mostReadAuthorsParser = new Parser({
        fields: mostReadAuthorsFields,
    });
    const top5MostReadBooksParser = new Parser({
        fields: top5MostReadBooksFields,
    });

    const mostReadGenresCsv = mostReadGenresParser.parse(mostReadGenres);
    const mostReadAuthorsCsv = mostReadAuthorsParser.parse(mostReadAuthors);
    const top5MostReadBooksCsv =
        top5MostReadBooksParser.parse(top5MostReadBooks);

    const csvString = `
        Most Read Genres
        ${mostReadGenresCsv}

        Most Read Authors
        ${mostReadAuthorsCsv}

        Top 5 Most Read Books
        ${top5MostReadBooksCsv}
    `;

    res.writeHead(200, {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=statistics.csv",
    });
    res.end(csvString);
    requestLogger(req.method, req.url, 200);
};

export default downloadStatistics;
