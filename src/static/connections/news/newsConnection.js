const newsContainer = document.querySelector('.news-container');

newsContainer.innerHTML = '<p class="placeholder">Loading...</p>';

const buildNews = (news) => {
    return news.map((news) => {
        const formatedDate = new Date(news.date)
            .toLocaleDateString('en-UK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
            .toString()
            .split('/')
            .join('-');

        return `
            <article class="article-card">
                <div class="article-card-header">
                    <h3 class="article-card-title">
                        ${news.title}
                    </h3>
                    <span class="article-card-date"
                        >${formatedDate}</span
                    >
                </div>
                <p class="acticle-card-content">
                    ${news.content}
                </p>
            </article>
        `;
    });
};

const loadNews = async () => {
    try {
        const response = await fetch('/api/news', {
            method: 'GET',
        });

        if (response.status === 200) {
            const data = await response.json();
            if (data.length === 0) {
                newsContainer.innerHTML =
                    '<p class="placeholder">No news yet</p>';
                return;
            }
            newsContainer.innerHTML = buildNews(data).join('');
        }
    } catch (error) {
        console.error(error);
    }
};

loadNews();