export const items = [
    {
        title: "New Manga: Berserk Vol. 1",
        link: "http://localhost:3000/books/Berserk_vol1",
        description: "Guts, the Black Swordsman, wanders around in a medieval world slaying demons as they are attracted to a demonic mark on his neck. To his help he has inhuman strength gained from a harsh childhood lived with mercenaries, a gigantic sword, an iron prosthetic left hand and the elf Puck. In his search for vengeance on the one who gave him the mark, he meets many interesting persons and creatures, whom all is affected by him in one way or another.",
    },
    {
        title: "Second Post",
        link: "http://example.com/second-post",
        description: "This is my second post",
    },
    {
        title: "Ma omor la revedere",
        link: "http://example.com/ma-omor-la-revedere",
        description: "This is my third post",
    },
    {
        title: "Fourth Post",
        link: "http://example.com/fourth-post",
        description: "This is my fourth post",
    },
    {
        title: "Fifth Post",
        link: "http://example.com/fifth-post",
        description: "This is my fifth post",
    },
    {
        title: "Sixth Post",
        link: "http://example.com/sixth-post",
        description: "This is my sixth post",
    },
    {
        title: "Seventh Post",
        link: "http://example.com/seventh-post",
        description: "This is my seventh post",
    },
    {
        title: "Eighth Post",
        link: "http://example.com/eighth-post",
        description: "This is my eighth post",
    },
    {
        title: "Ninth Post",
        link: "http://example.com/ninth-post",
        description: "This is my ninth post",
    },
    {
        title: "Tenth Post",
        link: "http://example.com/tenth-post",
        description: "This is my tenth post",
    },
];

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

export default createFeed;