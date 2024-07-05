const groupPageTemplate = (group) => {
return `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${group.name} - BookReviewer</title>
        <meta name="description" content="${group.description}" />
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
            href="/styles/modules/groups/group-page/index.css"
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
                    <a href="/" class="menu-list-link">Home</a>
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
                <div class="banner"></div>
                <img src="${group.imageLink}" alt="Group" class="group-image" />
                <div class="group-info">
                    <h2 class="group-name">${group.name}</h2>
                    <span class="group-members-count">Members: ${group.membersCount}</span>
                    <p class="group-description">${group.description.split('\n').join('<br>')}</p>
                </div>
                <div class="group-buttons-container">
                    <button class="button" id="joinButton">Join group</button>
                    <button class="button" id="leaveButton">Leave group</button>
                    <button class="button" id="deleteGroupButton">Delete</button>
                    <button class="button" id="editGroupButton">Edit</button>
                </div>
                <section class="chat-section">
                    <div class="chat-section-title-container">
                        <h2 class="chat-section-title">Chat</h2>
                    </div>
                    <form class="chat-section-form" id="messageForm">
                        <div class="input-group" id="messageGroup">
                            <textarea
                                class="input-text"
                                placeholder="Write in chat..."
                                id="messageInput"
                            ></textarea>
                            <span class="input-error" id="messageError"></span>
                        </div>
                        <button type="submit" class="button" id="sendButton">Send</button>
                    </form>
                    <div class="messages">
                        <p class="placeholder">Loadin...</p>
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
                                    <a
                                        href="/"
                                        class="footer-column-link"
                                        >API</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div class="footer-copyright">
                        <ul class="footer-buttons">
                            <li>
                                <button class="footer-button" onclick="handleNavigate('/rss.xml')">
                                    <i class="fa-solid fa-rss"></i>
                                </button>
                            </li>
                            <li>
                                <button class="footer-button" onclick="toggleTheme()">
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
        <script src="/connections/groups/joinGroupConnection.js"></script>
        <script src="/connections/groups/showMessagesConnection.js"></script>
        <script src="/connections/groups/createMessageConnection.js"></script>
        <script src="/utils/handleAlert.js"></script>
        <script src="/utils/handleNavigate.js"></script>
        <script src="/utils/handleOpenMenu.js"></script>
        <script src="/utils/handleTheme.js"></script>
    </body>
</html>
    `;
};

export default groupPageTemplate;