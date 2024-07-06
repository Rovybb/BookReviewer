const booksGrid = document.querySelector(".books-grid");

const buildBookCard = (book) => {
    return `
    <div
        class="books-grid-card"
        onclick="handleNavigate('/books/${book.id}')"
    >
        <img
            src="${book.imageLink}"
            alt="${book.title}"
            class="books-grid-card-image"
            title="${book.title}"
        />
    </div>
    `;
};

const showBooks = async () => {
    const token = document.cookie.split('=')[1];

    try {
        const response = await fetch("/api/users/booklist", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const books = await response.json();

        booksGrid.innerHTML = books ? books.map(buildBookCard).join("") : "No books added to list";
    } catch (error) {
        console.error(error);
    }
};

showBooks();