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
        <link rel="stylesheet" href="/books/${book.id}/index.css" />
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
                        <div class="book-card-buttons">
                            <button class="button" id="addToListButton"><i class="fa fa-plus"></i> Add</button>
                            <button class="button" id="removeFromListButton"><i class="fa fa-minus"></i> Remove</button>
                            <button class="button" id="deleteBookButton">Delete</button>
                            <button class="button" id="editBookButton">Edit</button>
                        </div>
                    </div>
                    <div class="book-card-details">
                        <h1 class="book-card-title">${book.title}</h1>
                        <p class="book-card-author">by ${book.author}</p>
                        <div class="book-card-rating">
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </div>
                        <span class="book-card-rating-text">${book.rating?.toFixed(2) || 0} / 5</span>
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
                        <div class="input-group" id="commentGroup">
                            <textarea
                                class="input-text"
                                id="commentField"
                                placeholder="Write a review..."
                            ></textarea>
                            <span class="input-error" id="commentError"></span>
                        </div>
                        <fieldset class="comment-section-form-rating rating">
                            <input type="radio" name="rating" id="rating5" value="5" />
                            <label for="rating5" class="fa fa-star"></label>
                            <input type="radio" name="rating" id="rating4" value="4" />
                            <label for="rating4" class="fa fa-star"></label>
                            <input type="radio" name="rating" id="rating3" value="3" />
                            <label for="rating3" class="fa fa-star"></label>
                            <input type="radio" name="rating" id="rating2" value="2" />
                            <label for="rating2" class="fa fa-star"></label>
                            <input type="radio" name="rating" id="rating1" value="1" />
                            <label for="rating1" class="fa fa-star"></label>
                        </fieldset>
                        <br>
                        <button type="submit" class="button" id="submitComment">Submit</button>
                    </form>
                    <div class="comments">
                        <p class="placeholder">Loading...</p>
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
                                    <a href="/#news" class="footer-column-link"
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
        <script src="/connections/books/buttonsConnection.js"></script>
        <script src="/connections/books/createReviewConnection.js"></script>
        <script src="/connections/books/showReviewsConnection.js"></script>
        <script src="/utils/handleAlert.js"></script>
        <script src="/utils/handleNavigate.js"></script>
        <script src="/utils/handleOpenMenu.js"></script>
        <script src="/utils/handleTheme.js"></script>
    </body>
</html>
    `;
};

export default bookPageTemplate;