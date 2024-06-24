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
];

const createFeed = (items) => {
    return `
    <rss version="2.0">
        <channel>
            <title>Book Reviewer</title>
            <link>http://example.com</link>
            <description>Largest comunity of book lovers in the world with over 50 million reviews.<br/>Goodreads is a great place to promote your books.</description>
            ${items.map((item) => `
                <item>
                    <title>${item.title}</title>
                    <link>${item.link}</link>
                    <description>${item.description}</description>
                    <enclosure url="http://localhost:3000/assets/Berserk_vol1.jpg" length="0" type="image/png"/>
                </item>
                `).join("\n")}
        </channel>
    </rss>
    `;
};

export default createFeed;