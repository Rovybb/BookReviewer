const bookPageTemplate = (book) => {
    return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${book.title}</title>
        <meta name="description" content="${book.description}" />
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/public/apple-touch-icon.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/public/favicon-32x32.png"
        />
        <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/public/favicon-16x16.png"
        />
        <link rel="manifest" href="/public/site.webmanifest" />
        <link rel="stylesheet" href="/styles/layout/index.css" />
        <link
            rel="stylesheet"
            href="/styles/modules/books/book-page/index.css"
        />
        <script
            src="https://kit.fontawesome.com/3811cdfa76.js"
            crossorigin="anonymous"
        ></script>
    </head>
    <body class="dark-theme">
        <div class="mobile-menu">
            <span class="fa-solid fa-x mobile-menu-close-button"></span>
            <span class="mobile-menu-logo" onclick="handleNavigate('/')"
                >Book<mark>Reviewer</mark></span
            >
            <ul class="mobile-menu-list">
                <li class="mobile-menu-list-item">
                    <a href="/index" class="menu-list-link">Home</a>
                </li>
                <li class="mobile-menu-list-item">
                    <a href="/about" class="menu-list-link">About</a>
                </li>
                <li class="mobile-menu-list-item">
                    <a href="/books" class="menu-list-link">Books</a>
                </li>
                <li class="mobile-menu-list-item">
                    <a href="/groups" class="menu-list-link">Groups</a>
                </li>
                <li class="mobile-menu-list-item">
                    <a href="/login" class="menu-list-link">Login</a>
                </li>
            </ul>
        </div>
        <div class="container">
            <header class="header">
                <span
                    class="logo logo--clickable"
                    onclick="handleNavigate('/')"
                >
                    Book<mark>Reviewer</mark>
                </span>
                <nav class="nav">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="/" class="nav-link">Home</a>
                        </li>
                        <li class="nav-item">
                            <a href="/about" class="nav-link">About</a>
                        </li>
                        <li class="nav-item">
                            <a href="/books" class="nav-link">Books</a>
                        </li>
                        <li class="nav-item">
                            <a href="/groups" class="nav-link">Groups</a>
                        </li>
                    </ul>
                </nav>
                <button
                    id="loginButton"
                    class="button button--bordered"
                ></button>
                <div class="mobile-menu-button">
                    <span class="fa fa-bars"></span>
                </div>
            </header>
            <main class="main-content">
                <div class="book-card">
                    <div class="book-card-image">
                        <img
                            src="${book.imageLink}"
                            alt="${book.title}"
                        />
                        <button class="button">+Add</button>
                    </div>
                    <div class="book-card-details">
                        <h1 class="book-card-title">${book.title}</h1>
                        <p class="book-card-author">by ${book.author}</p>
                        <div class="book-card-rating">
                            ${Array.from({ length: Math.round(book.rating) }, (_, i) => `<span class="fa fa-star --filled"></span>`).join('')}
                            ${Array.from({ length: 5 - Math.round(book.rating) }, (_, i) => `<span class="fa fa-star"></span>`).join('')}
                        </div>
                        <span class="book-card-rating-text">${book.rating} / 5</span>
                        <div class="book-card-tag">
                            <i class="fa-solid fa-tag"></i
                            ><span id="bookGenre">${book.genre}</span>
                        </div>
                    </div>
                    <p class="book-card-description">
                        ${book.description.split('\n').join('<br>')}
                    </p>
                </div>
                <section class="comment-section">
                    <div class="comment-section-title-container">
                        <h2 class="comment-section-title">Reviews</h2>
                    </div>
                    <form class="comment-section-form">
                        <textarea
                            class="input-text"
                            placeholder="Write a review..."
                            required
                        ></textarea>
                        <div class="comment-section-form-rating">
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </div>
                        <button type="submit" class="button">Submit</button>
                    </form>
                    <div class="comments">
                        <div class="comment">
                            <div class="comment-header">
                                <img
                                    src="/assets/profile_placeholder.jpg"
                                    alt="User"
                                    class="comment-header-image"
                                />
                                <div class="comment-header-text">
                                    <span class="comment-author">Jane Doe</span>
                                    <span class="comment-date">01-01-2024</span>
                                </div>
                            </div>
                            <div class="comment-rating">
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                            </div>
                            <p class="comment-content">
                                This is a great manga! I love the art style and
                                the story is very interesting. I can't wait to
                                read the next volume.
                            </p>
                        </div>
                        <div class="comment">
                            <div class="comment-header">
                                <img
                                    src="/assets/profile_placeholder.jpg"
                                    alt="User"
                                    class="comment-header-image"
                                />
                                <div class="comment-header-text">
                                    <span class="comment-author">Jane Doe</span>
                                    <span class="comment-date">01-01-2024</span>
                                </div>
                            </div>
                            <div class="comment-rating">
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                                <span class="fa fa-star --filled"></span>
                            </div>
                            <p class="comment-content">
                                I've read the whole series and it's amazing! I
                                highly recommend it to anyone who loves dark
                                fantasy.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-logo">
                        <a href="/" class="footer-logo-link">
                            <span class="logo">Book<mark>Reviewer</mark></span>
                        </a>
                    </div>
                    <nav class="footer-nav">
                        <div class="footer-column">
                            <h5 class="footer-column-title">Explore</h5>
                            <ul class="footer-column-list">
                                <li>
                                    <a href="/books" class="footer-column-link"
                                        >Books</a
                                    >
                                </li>
                                <li>
                                    <a href="/groups" class="footer-column-link"
                                        >Groups</a
                                    >
                                </li>
                                <li>
                                    <a href="/" class="footer-column-link"
                                        >News</a
                                    >
                                </li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h5 class="footer-column-title">Info</h5>
                            <ul class="footer-column-list">
                                <li>
                                    <a href="/about" class="footer-column-link"
                                        >About</a
                                    >
                                </li>
                                <li>
                                    <a href="/help" class="footer-column-link"
                                        >Help</a
                                    >
                                </li>
                                <li>
                                    <a href="/help" class="footer-column-link"
                                        >Contact</a
                                    >
                                </li>
                            </ul>
                        </div>
                        <div class="footer-column">
                            <h5 class="footer-column-title">Resources</h5>
                            <ul class="footer-column-list">
                                <li>
                                    <a
                                        href="/documentation"
                                        class="footer-column-link"
                                        >Documentation</a
                                    >
                                </li>
                                <li>
                                    <a href="/" class="footer-column-link"
                                        >API</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div class="footer-copyright">
                        <ul class="footer-buttons">
                            <li>
                                <button
                                    class="footer-button"
                                    onclick="handleNavigate('/rss.xml')"
                                >
                                    <i class="fa-solid fa-rss"></i>
                                </button>
                            </li>
                            <li>
                                <button
                                    class="footer-button"
                                    onclick="toggleTheme()"
                                >
                                    <i
                                        class="fa-solid fa-moon"
                                        id="themeButtonIcon"
                                    ></i
                                    ><i
                                        class="fa-solid fa-sun"
                                        id="themeButtonIcon"
                                    ></i>
                                </button>
                            </li>
                        </ul>
                        <p class="footer-copyright-info">
                            &copy; 2024 BookReviewer. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
        <script src="/connections/headerButtonConnection.js"></script>
        <script src="/utils/handleNavigate.js"></script>
        <script src="/utils/handleOpenMenu.js"></script>
        <script src="/utils/handleTheme.js"></script>
    </body>
</html>
    `;
};

export default bookPageTemplate;