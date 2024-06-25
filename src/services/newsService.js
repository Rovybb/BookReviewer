const { getReadingStatistics } = require('./statisticsService');

async function getAllNews() {

    const statistics = await getReadingStatistics();

    const news = [{
        title: 'Most popular author and genre this week',
        link: 'http://localhost:3000',
        description: `This week's most read author is ${statistics.mostReadAuthors[0].author} and the most read genre is ${statistics.mostReadGenres[0].genre}.`
    },
    {
        title: 'Top 5 most read books this week',
        link: 'http://localhost:3000',
        description: `These are the top 5 most read books this week: ${statistics.top5MostReadBooks.map(book => book.title).join(", ")}.`
    }];
    return news;
}
const createFeed = (items) => {
    return `
    <rss version="2.0">
        <channel>
            <title>Book Reviewer</title>
            <link>http://localhost:3000</link>
            <description><![CDATA[Largest comunity of book lovers in the world with over 50 million reviews.<br/>Goodreads is a great place to promote your books.]]></description>
            <language>en</language>
            ${items.map((item) => `
                <item>
                    <title>${item.title}</title>
                    <link>${item.link}</link>
                    <description>${item.description}</description>
                    <author>
                        <![CDATA[
                            <a href="http://localhost:3000">Book Reviewer</a>
                        ]]>
                    </author>
                    <category>Books</category>
                    <enclosure url="http://localhost:3000/assets/banner.png" length="0" type="image/png"/>
                </item>
                `).join("\n")}
        </channel>
    </rss>
    `;
};

module.exports = {
    getAllNews,
    createFeed
};